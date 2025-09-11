const { PrismaClient } = require("./sqlite-client");
const fs = require("fs");

// إنشاء عميل Prisma للقاعدة المحلية (SQLite)
const localPrisma = new PrismaClient();

async function exportData() {
  try {
    console.log("🔍 جاري استخراج البيانات من قاعدة البيانات المحلية...");

    // استخراج الفعاليات
    const events = await localPrisma.event.findMany({
      include: {
        seats: true,
        bookings: {
          include: {
            seat: true,
          },
        },
      },
    });

    // استخراج المشرفين
    const admins = await localPrisma.admin.findMany();

    // استخراج الإعدادات
    const settings = await localPrisma.settings.findMany();

    const exportData = {
      events,
      admins,
      settings,
      exportDate: new Date().toISOString(),
      totalEvents: events.length,
      totalSeats: events.reduce(
        (total, event) => total + event.seats.length,
        0
      ),
      totalBookings: events.reduce(
        (total, event) => total + event.bookings.length,
        0
      ),
    };

    // حفظ البيانات في ملف JSON
    fs.writeFileSync(
      "data-export.json",
      JSON.stringify(exportData, null, 2),
      "utf8"
    );

    console.log("✅ تم استخراج البيانات بنجاح!");
    console.log(`📊 إحصائيات البيانات المستخرجة:`);
    console.log(`   - الفعاليات: ${exportData.totalEvents}`);
    console.log(`   - المقاعد: ${exportData.totalSeats}`);
    console.log(`   - الحجوزات: ${exportData.totalBookings}`);
    console.log(`   - المشرفين: ${admins.length}`);
    console.log(`   - الإعدادات: ${settings.length}`);
    console.log(`📁 تم حفظ البيانات في: data-export.json`);
  } catch (error) {
    console.error("❌ خطأ في استخراج البيانات:", error);
  } finally {
    await localPrisma.$disconnect();
  }
}

exportData();
