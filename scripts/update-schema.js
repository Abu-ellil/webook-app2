const fs = require('fs');
const path = require('path');

// Path to the Prisma schema file
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

// Read the current schema
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

// Replace PostgreSQL with SQLite
const updatedSchema = schemaContent.replace(
  /datasource db \{[\s\S]*?provider = "postgresql"[\s\S]*?url\s+=\s+env\("DATABASE_URL"\)[\s\S]*?\}/,
  `datasource db {
    provider = "sqlite"
    url      = env("DATABASE_URL")
  }`
);

// Write the updated schema back to the file
fs.writeFileSync(schemaPath, updatedSchema);

console.log("✅ Updated Prisma schema to use SQLite");
