ALTER TABLE transactions DROP COLUMN IF EXISTS paid_by;

-- Buat tabel transaction_payers
CREATE TABLE transaction_payers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL
);

-- Grant akses
GRANT ALL ON transaction_payers TO service_role;
GRANT ALL ON transactions TO service_role;
GRANT ALL ON transaction_splits TO service_role;