-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  serial_number TEXT NOT NULL UNIQUE,
  model TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('donated', 'received', 'data_wipe', 'refurbishing', 'qa_testing', 'ready', 'distributed')),
  location TEXT NOT NULL,
  assigned_to TEXT,
  received_date TIMESTAMP WITH TIME ZONE NOT NULL,
  distributed_date TIMESTAMP WITH TIME ZONE,
  partner_id UUID REFERENCES partners(id),
  tech_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  device_count INTEGER NOT NULL CHECK (device_count > 0),
  location TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('urgent', 'high', 'normal')) DEFAULT 'normal',
  status TEXT NOT NULL CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed')) DEFAULT 'pending',
  requested_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  assigned_tech_id UUID,
  certificate_issued BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('school', 'library', 'nonprofit', 'veteran_org', 'other')),
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT NOT NULL,
  county TEXT NOT NULL,
  devices_received INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training_sessions table
CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  instructor TEXT NOT NULL,
  attendee_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('success', 'warning', 'info')) DEFAULT 'info',
  icon TEXT DEFAULT '📝',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_devices_received_date ON devices(received_date DESC);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_priority ON donations(priority);
CREATE INDEX IF NOT EXISTS idx_partners_county ON partners(county);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to auto-update updated_at
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_sessions_updated_at BEFORE UPDATE ON training_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all access for now - can be restricted later based on auth)
CREATE POLICY "Allow all access to devices" ON devices FOR ALL USING (true);
CREATE POLICY "Allow all access to donations" ON donations FOR ALL USING (true);
CREATE POLICY "Allow all access to partners" ON partners FOR ALL USING (true);
CREATE POLICY "Allow all access to training_sessions" ON training_sessions FOR ALL USING (true);
CREATE POLICY "Allow all access to activity_log" ON activity_log FOR ALL USING (true);
