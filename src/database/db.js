const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

class DatabaseManager {
    constructor() {
        const userDataPath = app.getPath('userData');
        this.dbPath = path.join(userDataPath, 'golden-fur.db');
        this.db = new Database(this.dbPath);
        this.initializeDatabase();
    }

    initializeDatabase() {
        // Create tables if they don't exist
        this.db.exec(`
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
        `);
    }

    // Pet CRUD operations - record_number is required
    getAllPets() {
        const stmt = this.db.prepare('SELECT * FROM pets ORDER BY updated_at DESC');
        return stmt.all();
    }

    searchPets(searchTerm) {
        const stmt = this.db.prepare(`
            SELECT * FROM pets 
            WHERE pet_name LIKE ? OR customer_name LIKE ? OR record_number LIKE ?
            ORDER BY updated_at DESC
        `);
        return stmt.all(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
    }

    getPetById(id) {
        const stmt = this.db.prepare('SELECT * FROM pets WHERE id = ?');
        return stmt.get(id);
    }

    createPet(petData) {
        const { pet_name, breed, customer_name, email, contact_number, record_number } = petData;
        
        // Validate record_number is provided
        if (!record_number || record_number.trim() === '') {
            throw new Error('Record number is required');
        }
        
        const stmt = this.db.prepare(`
            INSERT INTO pets (pet_name, breed, customer_name, email, contact_number, record_number)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        return stmt.run(pet_name, breed, customer_name, email, contact_number, record_number);
    }

    updatePet(id, petData) {
        const { pet_name, breed, customer_name, email, contact_number, record_number } = petData;
        
        // Validate record_number is provided
        if (!record_number || record_number.trim() === '') {
            throw new Error('Record number is required');
        }
        
        const stmt = this.db.prepare(`
            UPDATE pets 
            SET pet_name = ?, breed = ?, customer_name = ?, email = ?, contact_number = ?, 
                record_number = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        return stmt.run(pet_name, breed, customer_name, email, contact_number, record_number, id);
    }

    deletePet(id) {
        const stmt = this.db.prepare('DELETE FROM pets WHERE id = ?');
        return stmt.run(id);
    }

    // Check if record number already exists (for duplicate checking)
    checkRecordNumberExists(recordNumber) {
        if (!recordNumber) return false;
        const stmt = this.db.prepare('SELECT COUNT(*) as count FROM pets WHERE record_number = ?');
        const result = stmt.get(recordNumber);
        return result.count > 0;
    }

    // Get existing record numbers for suggestions - THIS IS THE MISSING METHOD
    getRecordNumbers() {
        try {
            const stmt = this.db.prepare(`
                SELECT record_number
                FROM pets
                WHERE record_number IS NOT NULL
                AND record_number != ''
                ORDER BY record_number
            `);

            return stmt.all().map(r => r.record_number);
        } catch (error) {
            console.error('Error getting record numbers:', error);
            return [];
        }
    }


    // Grooming Records CRUD operations (remain unchanged)
    getGroomingRecordsByPetId(petId) {
        const stmt = this.db.prepare(`
            SELECT * FROM grooming_records 
            WHERE pet_id = ? 
            ORDER BY grooming_date DESC
        `);
        return stmt.all(petId);
    }

    createGroomingRecord(recordData) {
    const { pet_id, grooming_date, size, groomer, hair_style } = recordData;

    const stmt = this.db.prepare(`
        INSERT INTO grooming_records
        (pet_id, grooming_date, size, groomer, hair_style)
        VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
        pet_id,
        grooming_date,
        size,
        groomer,
        hair_style
    );

    return { id: result.lastInsertRowid, ...recordData };
}

    updateGroomingRecord(id, recordData) {
    const { grooming_date, size, groomer, hair_style } = recordData;

    const stmt = this.db.prepare(`
        UPDATE grooming_records
        SET grooming_date = ?,
            size = ?,
            groomer = ?,
            hair_style = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `);

    stmt.run(
        grooming_date,
        size,
        groomer,
        hair_style,
        id
    );

    return { id, ...recordData };
}

    deleteGroomingRecord(id) {
        const stmt = this.db.prepare('DELETE FROM grooming_records WHERE id = ?');
        return stmt.run(id);
    }

    close() {
        this.db.close();
    }
}

export default DatabaseManager;