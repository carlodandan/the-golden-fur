-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_name TEXT NOT NULL,
    breed TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT,
    contact_number TEXT,
    record_number TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create grooming_records table (remove record_number from here)
CREATE TABLE IF NOT EXISTS grooming_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER NOT NULL,
    grooming_date DATE NOT NULL,
    size TEXT NOT NULL,
    groomer TEXT NOT NULL,
    hair_style TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pets_name ON pets(pet_name);
CREATE INDEX IF NOT EXISTS idx_pets_customer ON pets(customer_name);
CREATE INDEX IF NOT EXISTS idx_pets_record_number ON pets(record_number);
CREATE INDEX IF NOT EXISTS idx_grooming_pet ON grooming_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_grooming_date ON grooming_records(grooming_date);