import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendBreakEmailReminder } from '../src/workflows/emailWorkflow';

// 1. Load Environment Variables (Standalone)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');

console.log('Loading .env from:', envPath);

const envVars: Record<string, string> = {};
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            envVars[key.trim()] = value.trim();
        }
    });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || envVars.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Error: Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

// 2. Initialize Supabase Admin
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function runAutomation() {
    console.log(`[${new Date().toISOString()}] Starting Reminder Automation...`);

    // 3. Fetch Companies with Reminders Enabled
    const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .eq('reminder_enabled', true);

    if (companiesError) {
        console.error('Failed to fetch companies:', companiesError);
        return;
    }

    console.log(`Found ${companies.length} companies with reminders enabled.`);

    for (const company of companies) {
        try {
            const timezone = company.timezone || 'UTC';
            const reminderTimes = company.reminder_times || [];

            // Get current time in company's timezone (HH:MM)
            const formatter = new Intl.DateTimeFormat('en-GB', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            const currentTime = formatter.format(new Date());

            console.log(`Checking Company: ${company.name} (${timezone}). Local Time: ${currentTime}. Reminders: ${reminderTimes.join(', ')}`);

            if (reminderTimes.includes(currentTime)) {
                console.log(`>> Time Match! Sending reminders for ${company.name}...`);

                // 4. Fetch Active Employees
                const { data: employees, error: empError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('company_id', company.id)
                    .eq('role', 'employee')
                    .eq('status', 'active');

                if (empError) {
                    console.error('Failed to fetch employees:', empError);
                    continue;
                }

                if (!employees || employees.length === 0) {
                    console.log('No active employees found to remind.');
                    continue;
                }

                // 5. Trigger Email Workflow
                for (const employee of employees) {
                    // Call the new workflow function
                    await sendBreakEmailReminder(supabase, employee.id, company.id);
                }
            }
        } catch (err) {
            console.error(`Error processing company ${company.name}:`, err);
        }
    }

    console.log(`[${new Date().toISOString()}] Automation Finished.`);
}

// Run
runAutomation();
