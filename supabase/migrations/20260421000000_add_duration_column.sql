-- Add course_duration column to receipts table
ALTER TABLE public.receipts 
ADD COLUMN course_duration TEXT;

-- Set default value for existing records
UPDATE public.receipts 
SET course_duration = '1 Month' 
WHERE course_duration IS NULL;
