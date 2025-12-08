-- Add reminder settings to companies table

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS reminder_times TEXT[] DEFAULT ARRAY['11:00', '14:00', '16:00'],
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
