const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkEvents() {
  console.log('Checking events in MongoDB...');

  // Try both environment variable names
  const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  
  if (!mongoUri) {
    console.error('❌ MongoDB URI not found in environment variables');
    process.exit(1);
  }

  console.log('Database URL:', mongoUri);

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('webook');
    
    // Check the Event collection (with capital E)
    const eventCollection = db.collection('Event');
    const eventCount = await eventCollection.countDocuments();
    console.log(`Total events in 'Event' collection: ${eventCount}`);
    
    if (eventCount > 0) {
      const events = await eventCollection.find().limit(5).toArray();
      console.log('Sample events:', JSON.stringify(events, null, 2));
    }
    
    // Also check the events collection (lowercase)
    const eventsCollection = db.collection('events');
    const eventsCount = await eventsCollection.countDocuments();
    console.log(`Total events in 'events' collection: ${eventsCount}`);
    
    if (eventsCount > 0) {
      const events = await eventsCollection.find().limit(5).toArray();
      console.log('Sample events:', JSON.stringify(events, null, 2));
    }
  } catch (error) {
    console.error('❌ Error checking events:', error);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

checkEvents();