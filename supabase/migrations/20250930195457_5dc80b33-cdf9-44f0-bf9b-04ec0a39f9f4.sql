-- Fix credit_transactions RLS policy
-- The INSERT policy with 'false' is unnecessarily restrictive
-- Service role operations bypass RLS anyway, so we should remove it
-- to avoid confusion and make the security model clearer

-- Drop the overly restrictive INSERT policy
DROP POLICY IF EXISTS "Only system can insert credit transactions" ON public.credit_transactions;

-- Add a clear comment to the table
COMMENT ON TABLE public.credit_transactions IS 'Credit transaction log. Insertions should only be performed by edge functions using service role credentials. No RLS policy for INSERT since only backend should create records.';

-- Keep the other policies as they are correct:
-- - Users can view their own transactions (SELECT policy exists)
-- - No one can update or delete transactions (audit trail integrity)