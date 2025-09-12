const { PrismaClient } = require("./sqlite-client");

// إنشاء عميل Prisma للقاعدة المحلية (SQLite)
const prisma = new PrismaClient();

async function getAllEvents() {
  try {
    console.log("🔍 جاري جلب جميع الفعاليات من قاعدة البيانات...");

    // جلب جميع الفعاليات مع المقاعد والحجوزات المرتبطة بها
    const events = await prisma.event.findMany({
      include: {
        seats: true,
        bookings: {
          include: {
            seat: true,
          },
        },
      },
      orderBy: {
        date: 'asc', // ترتيب الفعاليات حسب التاريخ
      },
    });

    // طباعة عدد الفعاليات
    console.log(`✅ تم العثور على ${events.length} فعالية`);

    // طباعة تفاصيل كل فعالية
    events.forEach((event, index) => {
      console.log(`\n📋 الفعالية #${index + 1}:`);
      console.log(`   - العنوان: ${event.title}`);
      console.log(`   - التاريخ: ${event.date.toLocaleString()}`);
      console.log(`   - المكان: ${event.venue}`);
      console.log(`   - التصنيف: ${event.category}`);
      console.log(`   - عدد المقاعد: ${event.seats.length}`);
      console.log(`   - عدد الحجوزات: ${event.bookings.length}`);

      // طباعة تفاصيل المقاعد
      if (event.seats.length > 0) {
        console.log(`\n   🪑 تفاصيل المقاعد:`);
        const seatCategories = {};
        event.seats.forEach(seat => {
          if (!seatCategories[seat.category]) {
            seatCategories[seat.category] = 0;
          }
          seatCategories[seat.category]++;
        });

        for (const category in seatCategories) {
          const bookedSeats = event.seats.filter(seat => seat.category === category && seat.isBooked).length;
          console.log(`      - ${category}: ${seatCategories[category]} مقعد (محجوز: ${bookedSeats})`);
        }
      }
    });

    // حفظ البيانات في ملف JSON
    const eventData = {
      events,
      count: events.length,
      exportDate: new Date().toISOString(),
    };

    const fs = require("fs");
    fs.writeFileSync(
      "events-export.json",
      JSON.stringify(eventData, null, 2),
      "utf8"
    );

    console.log(`\n📁 تم حفظ بيانات الفعاليات في: events-export.json`);

    return eventData;
  } catch (error) {
    console.error("❌ خطأ في جلب الفعاليات:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// تشغيل الدالة إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  getAllEvents()
    .then(() => {
      console.log("\n� اكتملت عملية جلب الفعاليات بنجاح!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ فشلت عملية جلب الفعاليات:", error);
      process.exit(1);
    });
}

// تصدير الدالة للاستخدام في ملفات أخرى
module.exports = { getAllEvents };
