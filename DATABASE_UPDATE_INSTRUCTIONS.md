# Database Update Instructions

## Course Duration Column Added

A new column `course_duration` has been added to the receipts table.

### To apply this migration to your Supabase database:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to "SQL Editor" from the left sidebar
4. Copy and paste the following SQL:

```sql
-- Add course_duration column to receipts table
ALTER TABLE public.receipts 
ADD COLUMN course_duration TEXT;

-- Set default value for existing records
UPDATE public.receipts 
SET course_duration = '1 Month' 
WHERE course_duration IS NULL;
```

5. Click "Run" to execute the migration

### OR if you're using Supabase CLI:

```bash
supabase db push
```

This will automatically apply all pending migrations from the `supabase/migrations` folder.

---

## What's New?

- Added "Course Duration" field in the receipt form
- Options available: 1 Month, 3 Months, 6 Months, 1 Year, Others
- Duration now displays on the receipt
- All existing receipts will default to "1 Month"
