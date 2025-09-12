require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

async function checkAdmin() {
  console.log("🔗 Connecting to database...");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Check if admin table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Admin (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check if admin user exists
    const result = await pool.query("SELECT * FROM Admin WHERE username = 'admin'");
    
    if (result.rows.length === 0) {
      // Admin user doesn't exist, create one
      console.log("Admin user not found, creating new admin user...");
      
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash("admin123", saltRounds);
      
      // Insert admin user
      await pool.query(
        "INSERT INTO Admin (username, password) VALUES ($1, $2)",
        ["admin", hashedPassword]
      );
      
      console.log("Admin user created successfully with username: admin, password: admin123");
    } else {
      console.log("Admin user already exists:", result.rows[0]);
    }
  } catch (error) {
    console.error("Error checking admin:", error);
  } finally {
    await pool.end();
  }
}

checkAdmin();