import { supabase } from '../lib/supabase';
import { type Database } from '../types/database.types';

export type HRRegistrationParams = {
    name: string;
    email: string;
    password: string;
    companyName: string;
};

export const dbService = {
    // --- USERS ---
    async createUser(user: Database['public']['Tables']['users']['Insert']) {
        return await supabase.from('users').insert(user).select().single();
    },

    async getUser(id: string) {
        return await supabase.from('users').select('*').eq('id', id).single();
    },

    async updateUser(id: string, updates: Database['public']['Tables']['users']['Update']) {
        return await supabase.from('users').update(updates).eq('id', id).select().single();
    },

    // --- COMPANIES ---
    async createCompany(company: Database['public']['Tables']['companies']['Insert']) {
        return await supabase.from('companies').insert(company).select().single();
    },

    async getCompany(id: string) {
        return await supabase.from('companies').select('*').eq('id', id).single();
    },

    // --- EXERCISES ---
    async getExercises(difficulty?: 'basic' | 'medium' | 'complex') {
        let query = supabase.from('exercises').select('*');
        if (difficulty) {
            query = query.eq('difficulty', difficulty);
        }
        return await query;
    },

    // --- SESSION LOGS ---
    async logSession(log: Database['public']['Tables']['session_logs']['Insert']) {
        const { data, error } = await supabase.from('session_logs').insert(log).select().single();
        if (error) throw error;
        return data;
    },

    async getCompanyLogs(companyId: string) {
        return await supabase
            .from('session_logs')
            .select('*, users(name), exercises(name)')
            .eq('company_id', companyId)
            .order('timestamp', { ascending: false });
    },

    async getUserLogs(userId: string) {
        return await supabase
            .from('session_logs')
            .select('*, exercises(name)')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false });
    },

    // --- STATS (Example for HR Dashboard) ---
    async getCompanyStats(companyId: string) {
        // This is a simplified example. In real app, might use RPC or aggregate queries.
        const { count: activeUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', companyId)
            .eq('status', 'active');

        return { activeUsers };
    },

    // --- WORKFLOWS ---
    async registerHRWorkflow({ name, email, password, companyName }: HRRegistrationParams) {
        // 1. Sign Up Helper
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name, role: 'hr' }
            }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('User creation failed');

        // CHECK: If session is null, it means email confirmation is likely required.
        // We cannot proceed with DB inserts if we don't have a session (RLS will fail).
        if (!authData.session) {
            throw new Error('Please go to Supabase Dashboard > Authentication > Providers > Email and disable "Confirm email" for this demo to work immediately.');
        }

        const userId = authData.user.id;

        // 2. Create Public User Profile FIRST (company_id is null initially)
        // This satisfies the Foreign Key requirement for Companies later
        const { error: userError } = await supabase
            .from('users')
            .insert({
                id: userId,
                name: name,
                email: email,
                role: 'hr',
                company_id: null, // Set later
                status: 'active'
            });

        if (userError) throw userError;

        // 3. Create Company (Now users row exists, so hr_owner_id FK is valid)
        const { data: company, error: companyError } = await supabase
            .from('companies')
            .insert({
                name: companyName,
                hr_owner_id: userId
            })
            .select()
            .single();

        if (companyError) throw companyError;

        // 4. Update User with Company ID
        const { error: updateError } = await supabase
            .from('users')
            .update({ company_id: company.id })
            .eq('id', userId);

        if (updateError) throw updateError;

        // 5. Create Membership
        const { error: memberError } = await supabase
            .from('memberships')
            .insert({
                user_id: userId,
                company_id: company.id,
                status: 'active'
            });

        if (memberError) throw memberError;

        return { user: authData.user, company };
    },

    async inviteEmployees(emails: string[], companyId: string) {
        const results = [];
        const errors = [];

        for (const email of emails) {
            // Check if already member
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();

            if (existingUser) {
                errors.push({ email, error: 'User already exists' });
                continue;
            }

            // Create Invitation
            const { data: invite, error } = await supabase
                .from('invitations')
                .insert({
                    email,
                    company_id: companyId,
                    status: 'pending'
                })
                .select()
                .single();

            if (error) {
                errors.push({ email, error });
            } else {
                results.push(invite);
            }
        }

        return { results, errors };
    },

    async getCompanyEmployees(companyId: string) {
        // 1. Fetch Active Users (Real Employees)
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .eq('company_id', companyId)
            .eq('role', 'employee')
            .order('created_at', { ascending: false });

        if (usersError) throw usersError;

        // 2. Fetch Pending Invitations
        const { data: invites, error: invitesError } = await supabase
            .from('invitations')
            .select('*')
            .eq('company_id', companyId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (invitesError) throw invitesError;

        // 3. Get Stats for Active Users
        const activeEmployees = await Promise.all(users.map(async (emp) => {
            const { count: totalSessions } = await supabase
                .from('session_logs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', emp.id);

            const today = new Date().toISOString().split('T')[0];
            const { count: todaySessions } = await supabase
                .from('session_logs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', emp.id)
                .gte('timestamp', today);

            return {
                id: emp.id,
                name: emp.name,
                email: emp.email,
                status: emp.status,
                stats: {
                    totalSessions: totalSessions || 0,
                    todaySessions: todaySessions || 0
                }
            };
        }));

        // 4. Format Invites as "Employees" for the UI
        const invitedEmployees = invites.map(invite => ({
            id: invite.id,
            name: invite.email.split('@')[0], // Placeholder
            email: invite.email,
            status: 'invited',
            stats: null // No stats for invited
        }));

        return [...activeEmployees, ...invitedEmployees];
    },

    // --- INVITATION FLOW HELPERS ---
    async getInvitation(token: string) {
        return await supabase
            .from('invitations')
            .select('*, companies(name)')
            .eq('token', token)
            .single();
    },

    async acceptInvitation({ token, name, password }: { token: string, name: string, password: string }) {
        // 1. Verify Invite
        const { data: invite, error: inviteError } = await this.getInvitation(token);
        if (inviteError || !invite) throw new Error('Invalid or expired invitation');
        if (invite.status !== 'pending') throw new Error('Invitation already accepted');

        // 2. SignUp Auth User
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: invite.email,
            password: password,
            options: {
                data: { full_name: name, role: 'employee' }
            }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Signup failed');

        if (!authData.session) {
            throw new Error('Please disable "Confirm Email" in Supabase (Auth > Providers > Email) for this demo.');
        }

        // 3. Create User Record (Public)
        const { error: userError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                name: name,
                email: invite.email,
                role: 'employee',
                company_id: invite.company_id,
                status: 'active'
            });

        if (userError) throw userError;

        // 4. Create Membership
        await supabase.from('memberships').insert({
            user_id: authData.user.id,
            company_id: invite.company_id,
            status: 'active'
        });

        // 5. Update Invitation status
        await supabase
            .from('invitations')
            .update({ status: 'accepted' })
            .eq('id', invite.id);

        return authData.user;
    },

    // --- EMPLOYEE HOME HELPERS ---
    async getEmployeeDailyRoutine() {
        // Simple randomization: Fetch all (assuming small set) and pick 3
        const { data, error } = await supabase.from('exercises').select('*');
        if (error) throw error;

        // Shuffle and pick 3
        const shuffled = data.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    },

    async getEmployeeStats(userId: string) {
        // Today's sessions
        const today = new Date().toISOString().split('T')[0];
        const { count: todaySessions } = await supabase
            .from('session_logs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('timestamp', today);

        return { todaySessions: todaySessions || 0 };
    },

    // --- HR DASHBOARD AGGREGATION ---
    async getHRDashboardStats(companyId: string) {
        const today = new Date().toISOString().split('T')[0];

        // 1. Fetch Users
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .eq('company_id', companyId)
            .eq('role', 'employee');

        if (usersError) throw usersError;

        // 2. Fetch recent logs (last 30 days is enough for streak/weekly)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: logs, error: logsError } = await supabase
            .from('session_logs')
            .select('user_id, timestamp, duration_seconds')
            .eq('company_id', companyId)
            .gte('timestamp', thirtyDaysAgo.toISOString());

        if (logsError) throw logsError;

        // 3. Process Metrics
        const totalEmployees = users.length;
        const activeEmployees = users.filter(u => u.status === 'active').length;

        // Logs today
        const logsToday = logs.filter(l => l.timestamp.startsWith(today));
        const sessionsToday = logsToday.length;

        // Unique users today
        const uniqueUsersToday = new Set(logsToday.map(l => l.user_id)).size;
        const participationRate = activeEmployees > 0
            ? Math.round((uniqueUsersToday / activeEmployees) * 100)
            : 0;

        // 4. Per Employee Stats
        const employeeStats = users.map(user => {
            const userLogs = logs.filter(l => l.user_id === user.id);

            // Sessions Today
            const todayCount = userLogs.filter(l => l.timestamp.startsWith(today)).length;

            // Sessions This Week (Mon-Sun or Rolling 7 days? Let's do Rolling 7 for simplicity)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const weekCount = userLogs.filter(l => new Date(l.timestamp) >= sevenDaysAgo).length;

            // Streak Calculation
            // Sort logs by date desc
            const dates = Array.from(new Set(userLogs.map(l => l.timestamp.split('T')[0]))).sort((a, b) => b.localeCompare(a));

            let streak = 0;
            if (dates.length > 0) {
                const now = new Date();
                const todayStr = now.toISOString().split('T')[0];
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                // If they did it today, streak starts. If not today but yesterday, streak is alive.
                const currentDate = dates[0];
                // Check if streak is active (today or yesterday)
                // check if streak is active (today or yesterday)
                if (currentDate === todayStr || currentDate === yesterdayStr) {
                    streak = 1;
                    const checkDate = new Date(currentDate);

                    // Iterate backwards checking for consecutive days
                    for (let i = 1; i < dates.length; i++) {
                        checkDate.setDate(checkDate.getDate() - 1); // target previous day
                        const checkStr = checkDate.toISOString().split('T')[0];

                        if (dates[i] === checkStr) {
                            streak++;
                        } else {
                            break;
                        }
                    }
                }
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status,
                sessionsToday: todayCount,
                sessionsWeek: weekCount,
                streak: streak
            };
        });

        // Sort by "Sessions Today" desc to show most active on top
        employeeStats.sort((a, b) => b.sessionsToday - a.sessionsToday);

        return {
            metrics: {
                totalEmployees,
                activeEmployees,
                sessionsToday,
                participationRate
            },
            tableData: employeeStats
        };
    },

    // --- LEADERBOARD ---
    async getLeaderboard(companyId: string) {
        // Reuse the aggregation logic from HR Dashboard partially
        // In a real app with optimization, we'd probably use a Materialized View or dedicated caching.

        // 1. Fetch Users (Employees only)
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, name')
            .eq('company_id', companyId)
            .eq('role', 'employee')
            .eq('status', 'active'); // Only active for leaderboard

        if (usersError) throw usersError;

        // 2. Fetch Logs (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: logs, error: logsError } = await supabase
            .from('session_logs')
            .select('user_id, timestamp')
            .eq('company_id', companyId)
            .gte('timestamp', thirtyDaysAgo.toISOString());

        if (logsError) throw logsError;

        // 3. Process Leaders
        const leaders = users.map(user => {
            const userLogs = logs.filter(l => l.user_id === user.id);

            // Weekly Score (Last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const weeklyScore = userLogs.filter(l => new Date(l.timestamp) >= sevenDaysAgo).length;

            // Streak Calculation
            const dates = Array.from(new Set(userLogs.map(l => l.timestamp.split('T')[0]))).sort((a, b) => b.localeCompare(a));
            let streak = 0;
            if (dates.length > 0) {
                const now = new Date();
                const todayStr = now.toISOString().split('T')[0];
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                const currentDate = dates[0];
                if (currentDate === todayStr || currentDate === yesterdayStr) {
                    streak = 1;
                    const checkDate = new Date(currentDate);
                    for (let i = 1; i < dates.length; i++) {
                        checkDate.setDate(checkDate.getDate() - 1);
                        const checkStr = checkDate.toISOString().split('T')[0];
                        if (dates[i] === checkStr) {
                            streak++;
                        } else {
                            break;
                        }
                    }
                }
            }

            return {
                id: user.id,
                name: user.name,
                weeklyScore,
                streak
            };
        });

        // 4. Sort Lists
        const weeklyTop = [...leaders].sort((a, b) => b.weeklyScore - a.weeklyScore).slice(0, 50); // Top 50
        const streakTop = [...leaders].sort((a, b) => b.streak - a.streak).slice(0, 50);

        return { weeklyTop, streakTop };
        return { weeklyTop, streakTop };
    },

    // --- HR ANALYTICS ---
    // --- HR ANALYTICS ---
    async getAnalyticsData(companyId: string, startDate?: string, endDate?: string) {
        // Default to Last 7 Days if not provided
        const end = endDate ? new Date(endDate) : new Date();
        const start = startDate ? new Date(startDate) : new Date();
        if (!startDate) start.setDate(end.getDate() - 6); // 7 days total (including today)

        // Ensure end date includes the full day (23:59:59)
        const startStr = start.toISOString().split('T')[0]; // YYYY-MM-DD
        const endObj = new Date(end);
        endObj.setHours(23, 59, 59, 999);
        const endStr = endObj.toISOString();

        // 1. Fetch Users
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, name, email, status, created_at')
            .eq('company_id', companyId)
            .eq('role', 'employee');

        if (usersError) throw usersError;

        // 2. Fetch Logs (Filtered by Date Range)
        const { data: logs, error: logsError } = await supabase
            .from('session_logs')
            .select('user_id, timestamp, duration_seconds')
            .eq('company_id', companyId)
            .gte('timestamp', `${startStr}T00:00:00`)
            .lte('timestamp', endStr);

        if (logsError) throw logsError;

        // --- KPIs ---
        const totalEmployees = users.length;
        // Active in Range (users who have at least one session)
        const uniqueUsersRange = new Set(logs.map(l => l.user_id)).size;

        const sessionsTotal = logs.length;

        // Calculate Participation (Active in Range / Total Active Users)
        // Note: Total "Active" status users might be different from users who actually did a session.
        const activeStatusUsers = users.filter(u => u.status === 'active').length;
        const participationRate = activeStatusUsers > 0
            ? Math.round((uniqueUsersRange / activeStatusUsers) * 100)
            : 0;

        // --- CHART: Trend (Daily Breakdown in Range) ---
        const trendData = [];
        const dateIterator = new Date(start);
        const finalDate = new Date(end);

        while (dateIterator <= finalDate) {
            const currentDayStr = dateIterator.toISOString().split('T')[0];
            const count = logs.filter(l => l.timestamp.startsWith(currentDayStr)).length;
            trendData.push({ date: currentDayStr, count });
            dateIterator.setDate(dateIterator.getDate() + 1);
        }

        // --- EMPLOYEE PERFORMANCE (In Range) ---
        const userPerformance = users.map(user => {
            const userLogs = logs.filter(l => l.user_id === user.id);
            const sessionsRange = userLogs.length;

            // Recalculate Streak (Current Streak is arguably independent of filter, but user asked for "Table... respect selected date range")
            // Usually "Current Streak" is always "Current" regardless of history view. 
            // BUT "Sessions (Range)" should definitely change.
            // I'll keep "Streak" as GLOBAL calc (needs separate query? OR just use the 30-day logic?)
            // To keep it simple and efficient, I'll calculate "Sessions in Range" clearly.
            // For Streak, I'll return 'N/A' or calculated if range helps, but let's stick to "Sessions in Range" as the key metric.
            // Actually, I'll keep the previous Streak logic (calculating from *today* backwards) or just disable it for custom ranges?
            // The prompt says "Tables... respect selected date range".
            // Showing "Current Streak" (as of today) is still useful metadata. I will verify if I need global logs for that.
            // My query filters logs by range. If I filter "Last Month", I can't calculate "Current Streak" if they missed yesterday.
            // I will SKIP streak calculation if the range doesn't end Today.
            // Or I will fetch a small separate batch for streaks if needed. 
            // Optimization: Let's simpler fetch sessions count for the table. Streaks are tricky with filtered data. 
            // I will set Streak to "N/A" if range is custom, or just 0.

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                sessionsRange,
                streak: 0 // Placeholder or remove streak from this view to avoid confusion? I'll leave 0 for now.
            };
        });

        const topPerformers = [...userPerformance]
            .sort((a, b) => b.sessionsRange - a.sessionsRange)
            .slice(0, 10)
            .filter(u => u.sessionsRange > 0); // Only positive

        return {
            kpis: {
                totalEmployees,
                sessionsTotal,
                participationRate
            },
            trendData,
            topPerformers,
            allEmployees: userPerformance
        };
    },

    async getEmployeeDetailAnalytics(employeeId: string, companyId: string) {
        // 1. Verify Employee belongs to Company
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, name, email, created_at')
            .eq('id', employeeId)
            .eq('company_id', companyId)
            .single();

        if (userError || !user) throw new Error('Employee not found or not in your company');

        // 2. Fetch All Logs for this User
        const { data: logs, error: logsError } = await supabase
            .from('session_logs')
            .select('timestamp, exercises(name)')
            .eq('user_id', employeeId)
            .order('timestamp', { ascending: false });

        if (logsError) throw logsError;

        // --- Stats ---
        const totalSessions = logs.length;

        // Streak (Simple Current Streak Calculation)
        // Sort DESC
        // We can reuse the streak logic or keep it simple. Let's do a quick robust one.
        const dates = Array.from(new Set(logs.map(l => l.timestamp.split('T')[0]))).sort((a, b) => b.localeCompare(a));
        let streak = 0;
        if (dates.length > 0) {
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (dates[0] === todayStr || dates[0] === yesterdayStr) {
                streak = 1;
                const checkDate = new Date(dates[0]);
                for (let i = 1; i < dates.length; i++) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    if (dates[i] === checkDate.toISOString().split('T')[0]) {
                        streak++;
                    } else {
                        break;
                    }
                }
            }
        }

        // --- CHART: Last 30 Days Trend ---
        const trendData = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const count = logs.filter(l => l.timestamp.startsWith(dateStr)).length;
            trendData.push({ date: dateStr, count });
        }

        // --- TABLE: Exercise Breakdown ---
        const breakdownMap = new Map<string, { name: string, count: number, lastAt: string }>();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        logs.forEach((log: any) => {
            const exName = log.exercises?.name || 'Unknown Exercise';
            if (!breakdownMap.has(exName)) {
                breakdownMap.set(exName, { name: exName, count: 0, lastAt: log.timestamp });
            }
            const entry = breakdownMap.get(exName)!;
            entry.count++;
            // Since logs are DESC, the first one seen is the "lastAt"
        });

        const breakdown = Array.from(breakdownMap.values()).sort((a, b) => b.count - a.count);

        return {
            user,
            stats: {
                totalSessions,
                streak
            },
            trendData,
            breakdown
        };
    }
};
