const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkSeats() {
  console.log('Checking seats in MongoDB...');

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
    
    // Check the Seat collection
    const seatCollection = db.collection('Seat');
    const seatCount = await seatCollection.countDocuments();
    console.log(`Total seats in 'Seat' collection: ${seatCount}`);
    
    if (seatCount > 0) {
      // Get sample seats
      const seats = await seatCollection.find().limit(10).toArray();
      console.log('Sample seats:', JSON.stringify(seats.slice(0, 3), null, 2));
      
      // Check if seats have prices
      const seatsWithPrices = seats.filter(seat => seat.price > 0);
      console.log(`Seats with prices: ${seatsWithPrices.length}`);
      
      // Get unique categories
      const categories = Array.from(new Set(seats.map(seat => seat.category)));
      console.log('Categories:', categories);
      
      // Get prices by category
      categories.forEach(category => {
        const categorySeats = seats.filter(seat => seat.category === category);
        if (categorySeats.length > 0) {
          const prices = categorySeats.map(seat => seat.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          console.log(`${category}: ${minPrice} - ${maxPrice}`);
        }
      });
    } else {
      console.log('No seats found in database');
    }
    
    // Check events and their seats
    const eventCollection = db.collection('Event');
    const events = await eventCollection.find().toArray();
    
    console.log('\n--- Event Seat Counts ---');
    for (const event of events) {
      const eventId = event._id.toString();
      const eventSeatCount = await seatCollection.countDocuments({ eventId });
      console.log(`Event "${event.title}" (${eventId}): ${eventSeatCount} seats`);
      
      if (eventSeatCount > 0) {
        // Get sample seats for this event
        const eventSeats = await seatCollection.find({ eventId }).limit(5).toArray();
        console.log(`  Sample seats for this event:`, JSON.stringify(eventSeats.slice(0, 2), null, 2));
      }
    }
  } catch (error) {
    console.error('❌ Error checking seats:', error);
 } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

checkSeats();