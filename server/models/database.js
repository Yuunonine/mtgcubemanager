const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/cubes.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  initializeTables() {
    const createCubesTable = `
      CREATE TABLE IF NOT EXISTS cubes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createCubeCardsTable = `
      CREATE TABLE IF NOT EXISTS cube_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cube_id TEXT NOT NULL,
        card_id TEXT NOT NULL,
        card_name TEXT NOT NULL,
        mana_cost TEXT,
        cmc INTEGER,
        type_line TEXT,
        oracle_text TEXT,
        colors TEXT,
        color_identity TEXT,
        rarity TEXT,
        set_code TEXT,
        quantity INTEGER DEFAULT 1,
        notes TEXT,
        tags TEXT,
        image_uri TEXT,
        price_usd TEXT,
        printed_name TEXT,
        printed_type_line TEXT,
        printed_text TEXT,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cube_id) REFERENCES cubes (id) ON DELETE CASCADE,
        UNIQUE(cube_id, card_id)
      )
    `;

    this.db.run(createCubesTable, (err) => {
      if (err) console.error('Error creating cubes table:', err);
    });

    this.db.run(createCubeCardsTable, (err) => {
      if (err) {
        console.error('Error creating cube_cards table:', err);
      } else {
        // Run migrations after table creation
        this.runMigrations();
      }
    });
  }

  runMigrations() {
    // Check if Japanese fields exist and add them if they don't
    this.db.all("PRAGMA table_info(cube_cards)", (err, columns) => {
      if (err) {
        console.error('Error checking table schema:', err);
        return;
      }

      const columnNames = columns.map(col => col.name);
      const requiredFields = ['printed_name', 'printed_type_line', 'printed_text', 'selected_printing'];
      
      requiredFields.forEach(field => {
        if (!columnNames.includes(field)) {
          console.log(`Adding missing column: ${field}`);
          this.db.run(`ALTER TABLE cube_cards ADD COLUMN ${field} TEXT`, (err) => {
            if (err) {
              console.error(`Error adding column ${field}:`, err);
            } else {
              console.log(`Successfully added column: ${field}`);
            }
          });
        }
      });
    });
  }

  getCube(cubeId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, 
               COUNT(cc.id) as card_count
        FROM cubes c
        LEFT JOIN cube_cards cc ON c.id = cc.cube_id
        WHERE c.id = ?
        GROUP BY c.id
      `;
      
      this.db.get(query, [cubeId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  getAllCubes() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.id, c.name, c.description, c.created_at,
               COUNT(cc.id) as card_count
        FROM cubes c
        LEFT JOIN cube_cards cc ON c.id = cc.cube_id
        GROUP BY c.id, c.name, c.description, c.created_at
        ORDER BY c.updated_at DESC
      `;
      
      this.db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  createCube(cubeData) {
    return new Promise((resolve, reject) => {
      const { id, name, description } = cubeData;
      const query = `
        INSERT INTO cubes (id, name, description)
        VALUES (?, ?, ?)
      `;
      
      this.db.run(query, [id, name, description], function(err) {
        if (err) reject(err);
        else resolve({ id, name, description });
      });
    });
  }

  getCubeCards(cubeId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM cube_cards
        WHERE cube_id = ?
        ORDER BY card_name
      `;
      
      this.db.all(query, [cubeId], (err, rows) => {
        if (err) reject(err);
        else {
          const cards = rows.map(row => {
            let selected_printing = null;
            if (row.selected_printing) {
              try {
                selected_printing = JSON.parse(row.selected_printing);
              } catch (e) {
                console.error('Error parsing selected_printing:', e);
              }
            }
            
            return {
              id: row.card_id,
              name: row.card_name,
              mana_cost: row.mana_cost,
              cmc: row.cmc,
              type_line: row.type_line,
              oracle_text: row.oracle_text,
              colors: row.colors ? JSON.parse(row.colors) : [],
              color_identity: row.color_identity ? JSON.parse(row.color_identity) : [],
              rarity: row.rarity,
              set: row.set_code,
              quantity: row.quantity,
              notes: row.notes,
              tags: row.tags ? JSON.parse(row.tags) : [],
              image_uri: row.image_uri,
              image_uris: row.image_uri ? { normal: row.image_uri, small: row.image_uri } : undefined,
              prices: row.price_usd ? { usd: row.price_usd } : undefined,
              printed_name: row.printed_name || null,
              printed_type_line: row.printed_type_line || null,
              printed_text: row.printed_text || null,
              selected_printing: selected_printing
            };
          });
          resolve(cards);
        }
      });
    });
  }

  addCardToCube(cubeId, cardData) {
    return new Promise((resolve, reject) => {
      console.log('Adding card to cube:', cardData.name, 'Image URI:', cardData.image_uri || cardData.image_uris?.normal);
      const query = `
        INSERT OR REPLACE INTO cube_cards (
          cube_id, card_id, card_name, mana_cost, cmc, type_line,
          oracle_text, colors, color_identity, rarity, set_code,
          quantity, notes, tags, image_uri, price_usd,
          printed_name, printed_type_line, printed_text, selected_printing
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        cubeId,
        cardData.id,
        cardData.name,
        cardData.mana_cost || '',
        cardData.cmc || 0,
        cardData.type_line || '',
        cardData.oracle_text || '',
        JSON.stringify(cardData.colors || []),
        JSON.stringify(cardData.color_identity || []),
        cardData.rarity || '',
        cardData.set || '',
        cardData.quantity || 1,
        cardData.notes || '',
        JSON.stringify(cardData.tags || []),
        cardData.image_uri || cardData.image_uris?.normal || cardData.image_uris?.small || '',
        cardData.price_usd || cardData.prices?.usd || '',
        cardData.printed_name || '',
        cardData.printed_type_line || '',
        cardData.printed_text || '',
        cardData.selected_printing ? JSON.stringify(cardData.selected_printing) : null
      ];
      
      this.db.run(query, values, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  }

  removeCardFromCube(cubeId, cardId) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM cube_cards WHERE cube_id = ? AND card_id = ?`;
      
      this.db.run(query, [cubeId, cardId], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

module.exports = new Database();