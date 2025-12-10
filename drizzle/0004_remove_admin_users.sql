-- Drop admin_users table
DROP TABLE IF EXISTS "admin_users" CASCADE;

-- Drop the index if it exists
DROP INDEX IF EXISTS "admin_users_email_idx";
