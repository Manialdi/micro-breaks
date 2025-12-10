import { SupabaseClient } from '@supabase/supabase-js';

// Workflow: Send Break Email Reminder
export async function sendBreakEmailReminder(supabase: SupabaseClient, userId: string, companyId: string) {
    console.log(`[Workflow] Starting SendBreakEmailReminder for User: ${userId}`);

    // 1. Fetch User and Company Details
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (userError || !user) {
        console.error('[Workflow] Failed to fetch user', userError);
        return;
    }

    const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

    if (companyError || !company) {
        console.error('[Workflow] Failed to fetch company', companyError);
        return;
    }

    // 2. Generate Email Content
    const subject = `[Micro-Breaks] Time for your microbreak`;
    const body = `
Hi ${user.name},

It’s time for your quick Micro-Breaks routine.
Click below to complete today’s set.

Link: https://yourapp.com/employee/home

Keep moving 💪
    `;

    // 3. Send Email (Simulated "Antigravity Email Action")
    // In a real scenario, this would call an API like Resend, SendGrid, or AWS SES.
    await simulateEmailSend(user.email, subject, body);

    // 4. Log the Event
    const { error: logError } = await supabase
        .from('reminder_logs')
        .insert({
            user_id: userId,
            company_id: companyId,
            method: 'email',
            // sent_at defaults to now()
        });

    if (logError) {
        console.error('[Workflow] Failed to log reminder', logError);
    } else {
        console.log(`[Workflow] Reminder logged for ${user.email}`);
    }
}

async function simulateEmailSend(to: string, subject: string, body: string) {
    console.log(`\n>>> 📧 EMAIL START >>>`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${body}`);
    console.log(`<<< 📧 EMAIL END <<<\n`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
}
