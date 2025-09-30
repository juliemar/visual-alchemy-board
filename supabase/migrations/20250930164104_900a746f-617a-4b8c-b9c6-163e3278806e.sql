-- Create user_credits table for tracking credit balances
CREATE TABLE public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  credits_balance INTEGER NOT NULL DEFAULT 5,
  total_credits_purchased INTEGER NOT NULL DEFAULT 0,
  total_images_downloaded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own credits"
  ON public.user_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert credits"
  ON public.user_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update credits"
  ON public.user_credits FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-update trigger
CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create credit_transactions table for audit trail
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'download', 'bonus', 'refund')),
  credits_amount INTEGER NOT NULL,
  credits_balance_after INTEGER NOT NULL,
  stripe_payment_intent_id TEXT,
  image_node_id UUID REFERENCES public.nodes(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can view their own transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Auto-create credits record when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits_balance)
  VALUES (NEW.id, 5)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_credits();

-- Add download tracking to nodes table
ALTER TABLE public.nodes 
ADD COLUMN IF NOT EXISTS downloaded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS downloaded_by UUID REFERENCES auth.users(id);

-- Migrate existing pro users to get bonus credits
INSERT INTO public.user_credits (user_id, credits_balance, total_credits_purchased)
SELECT 
  s.user_id,
  100,
  100
FROM public.subscriptions s
WHERE s.plan = 'pro'
ON CONFLICT (user_id) 
DO UPDATE SET 
  credits_balance = 100,
  total_credits_purchased = 100;