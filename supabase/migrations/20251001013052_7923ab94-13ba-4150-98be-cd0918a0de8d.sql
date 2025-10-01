-- Add explicit INSERT policy to prevent unauthorized transaction creation
-- Only edge functions with service role credentials should create transactions
-- This policy explicitly denies all user-level INSERT attempts

CREATE POLICY "Deny direct inserts to credit_transactions" 
ON public.credit_transactions 
FOR INSERT 
WITH CHECK (false);

-- Update table comment to clarify the security model
COMMENT ON TABLE public.credit_transactions IS 'Credit transaction log. Insertions are explicitly denied for users and can only be performed by edge functions using service role credentials. This prevents financial fraud and credit manipulation.';