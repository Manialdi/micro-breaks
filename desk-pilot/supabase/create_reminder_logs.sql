-- Create ReminderLogs table to track sent notifications
create table if not exists reminder_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) not null,
  company_id uuid references companies(id) not null,
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
  method text not null check (method in ('email', 'slack', 'sms'))
);

-- RLS: HR can view logs for their company
alter table reminder_logs enable row level security;

create policy "HR can view company reminder logs"
on reminder_logs for select
using (
  exists (
      select 1 from users
      where users.id = auth.uid()
      and users.role = 'hr'
      and users.company_id = reminder_logs.company_id
  )
);
