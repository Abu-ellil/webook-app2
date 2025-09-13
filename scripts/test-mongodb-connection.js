const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  console.log('Testing MongoDB connection...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  console.log('Database URL:', process.env.DATABASE_URL);

  const client = new MongoClient(process.env.DATABASE_URL);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('webook');
    const adminCollection = db.collection('Admin');

    // Try to find an admin
    const admin = await adminCollection.findOne({ username: 'admin' });
    console.log('Admin found:', !!admin);

    if (admin) {
      console.log('Admin username:', admin.username);
      console.log('Admin password:', admin.password);
    }

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

testConnection();
