require("dotenv").config();
const { Pool } = require("pg");

async function checkAdmin() {
  console.log("🔗 Connecting to database...");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const result = await pool.query("SELECT * FROM Admin");
    console.log("Found admin users:", result.rows);
  } catch (error) {
    console.error("Error checking admin:", error);
  } finally {
    await pool.end();
  }
}

checkAdmin();