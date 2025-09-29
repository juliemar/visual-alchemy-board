-- Create boards table
CREATE TABLE IF NOT EXISTS public.boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create nodes table
CREATE TABLE IF NOT EXISTS public.nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  node_type TEXT NOT NULL CHECK (node_type IN ('image_upload', 'prompt', 'generated_image')),
  node_data JSONB DEFAULT '{}'::jsonb,
  position_x FLOAT NOT NULL DEFAULT 0,
  position_y FLOAT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create connections table
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  source_node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
  target_node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for boards
CREATE POLICY "Users can view their own boards"
  ON public.boards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own boards"
  ON public.boards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boards"
  ON public.boards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boards"
  ON public.boards FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for nodes
CREATE POLICY "Users can view nodes from their boards"
  ON public.nodes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.boards 
    WHERE boards.id = nodes.board_id 
    AND boards.user_id = auth.uid()
  ));

CREATE POLICY "Users can create nodes in their boards"
  ON public.nodes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.boards 
    WHERE boards.id = nodes.board_id 
    AND boards.user_id = auth.uid()
  ));

CREATE POLICY "Users can update nodes in their boards"
  ON public.nodes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.boards 
    WHERE boards.id = nodes.board_id 
    AND boards.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete nodes in their boards"
  ON public.nodes FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.boards 
    WHERE boards.id = nodes.board_id 
    AND boards.user_id = auth.uid()
  ));

-- RLS Policies for connections
CREATE POLICY "Users can view connections from their boards"
  ON public.connections FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.boards 
    WHERE boards.id = connections.board_id 
    AND boards.user_id = auth.uid()
  ));

CREATE POLICY "Users can create connections in their boards"
  ON public.connections FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.boards 
    WHERE boards.id = connections.board_id 
    AND boards.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete connections in their boards"
  ON public.connections FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.boards 
    WHERE boards.id = connections.board_id 
    AND boards.user_id = auth.uid()
  ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for boards
CREATE TRIGGER update_boards_updated_at
  BEFORE UPDATE ON public.boards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();