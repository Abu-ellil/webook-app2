require("dotenv").config();
const { PrismaClient } = require("./sqlite-client");

const prisma = new PrismaClient();

async function initDatabase() {
  console.log(
    "🔗 Connecting to:",
    process.env.DATABASE_URL?.substring(0, 50) + "..."  
  );

  try {
    // Test the connection
    await prisma.$connect();
    console.log("✅ Database connection established");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }

  try {
    // Create tables based on your Prisma schema
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Event (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        date DATETIME NOT NULL,
        venue TEXT NOT NULL,
        category TEXT DEFAULT 'حفل موسيقي',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await prisma.$executeRawUnsafe(`
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

    await prisma.$executeRawUnsafe(`
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
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (eventId) REFERENCES Event(id),
        FOREIGN KEY (seatId) REFERENCES Seat(id)
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Admin (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Settings (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Database tables created successfully!");

    // Check if we need to create an admin user
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      await prisma.admin.create({
        data: {
          id: 'admin-1',
          username: 'admin',
          password: 'admin123'
        }
      });
      console.log(
        "✅ Default admin user created (username: admin, password: admin123)"
      );
    }
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

initDatabase();
