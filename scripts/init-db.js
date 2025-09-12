require("dotenv").config();
const { Pool } = require("pg");

async function initDatabase() {
  console.log(
    "🔗 Connecting to:",
    process.env.DATABASE_URL?.substring(0, 50) + "..."
  );

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Create tables based on your Prisma schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Event (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        date TIMESTAMP NOT NULL,
        venue TEXT NOT NULL,
        category TEXT DEFAULT 'حفل موسيقي',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Seat (
        id TEXT PRIMARY KEY,
        eventId TEXT NOT NULL,
        row TEXT NOT NULL,
        number INTEGER NOT NULL,
        section TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        isBooked BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (eventId) REFERENCES Event(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Booking (
        id TEXT PRIMARY KEY,
        eventId TEXT NOT NULL,
        seatId TEXT UNIQUE NOT NULL,
        customerName TEXT NOT NULL,
        customerPhone TEXT NOT NULL,
        customerEmail TEXT,
        totalAmount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        paymentData TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (eventId) REFERENCES Event(id),
        FOREIGN KEY (seatId) REFERENCES Seat(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Admin (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Settings (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Database tables created successfully!");

    // Check if we need to create an admin user
    const adminCheck = await pool.query(
      "SELECT COUNT(*) as count FROM Admin"
    );
    if (parseInt(adminCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO Admin (id, username, password) 
        VALUES ('admin-1', 'admin', 'admin123')
      `);
      console.log(
        "✅ Default admin user created (username: admin, password: admin123)"
      );
    }
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  } finally {
    await pool.end();
  }
}

initDatabase();
