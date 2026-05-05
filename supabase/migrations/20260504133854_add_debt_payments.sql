CREATE TABLE debt_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  from_user UUID REFERENCES profiles(id) ON DELETE CASCADE,
  to_user UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

GRANT ALL ON debt_payments TO service_role;