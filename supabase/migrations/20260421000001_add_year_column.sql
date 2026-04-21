-- Add year column to receipts table
ALTER TABLE public.receipts 
ADD COLUMN year TEXT;

-- Set default value for existing records
UPDATE public.receipts 
SET year = '2026' 
WHERE year IS NULL;
