-- Create enums
CREATE TYPE pet_type AS ENUM ('dog', 'cat', 'bird', 'rabbit', 'hamster', 'other');
CREATE TYPE pet_status AS ENUM ('available', 'pending', 'adopted', 'not_available');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');

-- Create pets table
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type pet_type NOT NULL,
  breed VARCHAR(255),
  age INTEGER,
  gender VARCHAR(50),
  size VARCHAR(50),
  color VARCHAR(100),
  description TEXT,
  status pet_status NOT NULL DEFAULT 'available',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  applicant_name VARCHAR(255) NOT NULL,
  applicant_email VARCHAR(255) NOT NULL,
  applicant_phone VARCHAR(50),
  applicant_address TEXT,
  application_text TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Create medical records table
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  procedure VARCHAR(255) NOT NULL,
  vet_name VARCHAR(100) NOT NULL,
  notes TEXT,
  cost DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_type ON pets(type);
CREATE INDEX idx_pets_created_at ON pets(created_at DESC);
CREATE INDEX idx_applications_pet_id ON applications(pet_id);
CREATE INDEX idx_medical_records_pet_id ON medical_records(pet_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applicant_email ON applications(applicant_email);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON pets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at
  BEFORE UPDATE ON medical_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE pets IS 'Stores information about pets available for adoption';
COMMENT ON TABLE applications IS 'Stores adoption applications submitted for pets';
COMMENT ON COLUMN pets.status IS 'Current availability status of the pet';
COMMENT ON COLUMN applications.status IS 'Current status of the adoption application';

