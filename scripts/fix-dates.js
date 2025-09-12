require("dotenv").config();
const { PrismaClient } = require("./sqlite-client");

const prisma = new PrismaClient();

async function fixEventDates() {
  try {
    console.log("🔍 Checking events with invalid date values...");

    // Find events with empty or invalid date values
    const invalidEvents = await prisma.$queryRaw`
      SELECT id, title, date FROM events WHERE date IS NULL OR date = ''
    `;

    console.log(`Found ${invalidEvents.length} events with invalid dates`);

    if (invalidEvents.length > 0) {
      console.log("Fixing invalid dates...");

      // Update each event with a default date (current date + 30 days)
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);

      for (const event of invalidEvents) {
        await prisma.event.update({
          where: { id: event.id },
          data: { 
            date: defaultDate 
          }
        });
        console.log(`✅ Fixed date for event: ${event.title}`);
      }

      console.log(`✅ Successfully fixed ${invalidEvents.length} events`);
    } else {
      console.log("✅ All events have valid date values");
    }

    // Also check for empty arrays in date field (which is the specific error)
    const eventsWithEmptyArrayDates = await prisma.$queryRaw`
      SELECT id, title, date FROM events WHERE date = '[]'
    `;

    if (eventsWithEmptyArrayDates.length > 0) {
      console.log(`\n🔍 Found ${eventsWithEmptyArrayDates.length} events with empty array dates`);

      // Update each event with a default date
      for (const event of eventsWithEmptyArrayDates) {
        await prisma.event.update({
          where: { id: event.id },
          data: { 
            date: defaultDate 
          }
        });
        console.log(`✅ Fixed empty array date for event: ${event.title}`);
      }

      console.log(`✅ Successfully fixed ${eventsWithEmptyArrayDates.length} events with empty array dates`);
    } else {
      console.log("\n✅ No events with empty array dates found");
    }

  } catch (error) {
    console.error("❌ Error fixing dates:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixEventDates();
