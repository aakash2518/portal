# Database Setup Instructions

## IMPORTANT: Run this SQL in Supabase Dashboard

The delete functionality requires a `deleted_at` column in the receipts table. Please follow these steps:

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" from the left sidebar

### Step 2: Run this SQL

```sql
-- Add deleted_at column for soft delete functionality
ALTER TABLE public.receipts 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries on non-deleted records
CREATE INDEX IF NOT EXISTS idx_receipts_deleted_at 
ON public.receipts(deleted_at) 
WHERE deleted_at IS NULL;

-- Add year column if not exists
ALTER TABLE public.receipts 
ADD COLUMN IF NOT EXISTS year TEXT;

-- Set default year for existing records
UPDATE public.receipts 
SET year = '2026-27' 
WHERE year IS NULL;
```

### Step 3: Click "Run" button

After running this SQL, the delete functionality will work:
- Click trash icon to move receipt to Bin
- Go to "Bin" tab to see deleted receipts
- Click restore icon to bring back from Bin
- Click trash icon in Bin to permanently delete

## Alternative: Using Supabase CLI

If you have Supabase CLI installed, you can run:

```bash
supabase db push
```

This will automatically apply all migrations from the `supabase/migrations` folder.

---

## Verification

After running the SQL, refresh your dashboard page. You should now be able to:
✅ Delete receipts (moves to Bin)
✅ View deleted receipts in Bin tab
✅ Restore receipts from Bin
✅ Permanently delete receipts from Bin
