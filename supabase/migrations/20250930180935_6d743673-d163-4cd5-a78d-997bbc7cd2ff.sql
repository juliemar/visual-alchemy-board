-- Add explicit RLS policies to prevent user manipulation of credit transactions
-- Only backend functions (using service role) should be able to insert transactions

-- Explicitly deny INSERT for regular users (backend uses service role which bypasses RLS)
CREATE POLICY "Only system can insert credit transactions"
ON public.credit_transactions
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Explicitly deny UPDATE - transactions should be immutable
CREATE POLICY "Credit transactions cannot be updated"
ON public.credit_transactions
FOR UPDATE
TO authenticated
USING (false);

-- Explicitly deny DELETE - transactions should be permanent records
CREATE POLICY "Credit transactions cannot be deleted"
ON public.credit_transactions
FOR DELETE
TO authenticated
USING (false);

-- Add comment explaining the security model
COMMENT ON TABLE public.credit_transactions IS 'Financial transaction log. INSERT operations are restricted to backend functions using service role. Users can only view their own transactions.';