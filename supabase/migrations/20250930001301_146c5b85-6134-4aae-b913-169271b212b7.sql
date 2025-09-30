-- Create storage bucket for board thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('board-thumbnails', 'board-thumbnails', true);

-- Add thumbnail_url column to boards table
ALTER TABLE public.boards
ADD COLUMN thumbnail_url TEXT;

-- Create RLS policies for board thumbnails bucket
CREATE POLICY "Users can view all thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'board-thumbnails');

CREATE POLICY "Users can upload their own board thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'board-thumbnails' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own board thumbnails"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'board-thumbnails' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own board thumbnails"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'board-thumbnails' AND
  auth.uid()::text = (storage.foldername(name))[1]
);