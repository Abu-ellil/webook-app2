require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

// إنشاء عميل Prisma للقاعدة الجديدة (PostgreSQL)
const newPrisma = new PrismaClient();

async function importData() {
  try {
    console.log("📥 جاري استيراد البيانات إلى قاعدة البيانات الجديدة...");

    // قراءة البيانات المستخرجة
    if (!fs.existsSync("data-export.json")) {
      console.error(
        "❌ ملف البيانات غير موجود! يرجى تشغيل export-data.js أولاً"
      );
      return;
    }

    const exportedData = JSON.parse(
      fs.readFileSync("data-export.json", "utf8")
    );

    console.log("📊 بيانات الاستيراد:");
    console.log(`   - الفعاليات: ${exportedData.totalEvents}`);
    console.log(`   - المقاعد: ${exportedData.totalSeats}`);
    console.log(`   - الحجوزات: ${exportedData.totalBookings}`);

    // استيراد المشرفين
    console.log("👤 جاري استيراد المشرفين...");
    for (const admin of exportedData.admins) {
      await newPrisma.admin.upsert({
        where: { username: admin.username },
        update: {
          password: admin.password,
        },
        create: {
          id: admin.id,
          username: admin.username,
          password: admin.password,
        },
      });
    }
    console.log(`✅ تم استيراد ${exportedData.admins.length} مشرف`);

    // استيراد الإعدادات
    console.log("⚙️ جاري استيراد الإعدادات...");
    for (const setting of exportedData.settings) {
      await newPrisma.settings.upsert({
        where: { key: setting.key },
        update: {
          value: setting.value,
          updatedAt: new Date(setting.updatedAt),
        },
        create: {
          id: setting.id,
          key: setting.key,
          value: setting.value,
          createdAt: new Date(setting.createdAt),
          updatedAt: new Date(setting.updatedAt),
        },
      });
    }
    console.log(`✅ تم استيراد ${exportedData.settings.length} إعداد`);

    // استيراد الفعاليات والمقاعد والحجوزات
    console.log("🎪 جاري استيراد الفعاليات...");
    for (const event of exportedData.events) {
      // إنشاء الفعالية
      const newEvent = await newPrisma.event.upsert({
        where: { id: event.id },
        update: {
          title: event.title,
          description: event.description,
          image: event.image,
          date: new Date(event.date),
          venue: event.venue,
          category: event.category,
          updatedAt: new Date(event.updatedAt),
        },
        create: {
          id: event.id,
          title: event.title,
          description: event.description,
          image: event.image,
          date: new Date(event.date),
          venue: event.venue,
          category: event.category,
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
        },
      });

      // استيراد المقاعد
      console.log(
        `   📺 جاري استيراد ${event.seats.length} مقعد للفعالية: ${event.title}`
      );
      for (const seat of event.seats) {
        await newPrisma.seat.upsert({
          where: { id: seat.id },
          update: {
            row: seat.row,
            number: seat.number,
            section: seat.section,
            price: seat.price,
            category: seat.category,
            isBooked: seat.isBooked,
          },
          create: {
            id: seat.id,
            eventId: seat.eventId,
            row: seat.row,
            number: seat.number,
            section: seat.section,
            price: seat.price,
            category: seat.category,
            isBooked: seat.isBooked,
          },
        });
      }

      // استيراد الحجوزات
      console.log(
        `   🎫 جاري استيراد ${event.bookings.length} حجز للفعالية: ${event.title}`
      );
      for (const booking of event.bookings) {
        await newPrisma.booking.upsert({
          where: { id: booking.id },
          update: {
            customerName: booking.customerName,
            customerPhone: booking.customerPhone,
            customerEmail: booking.customerEmail,
            totalAmount: booking.totalAmount,
            status: booking.status,
            paymentData: booking.paymentData,
          },
          create: {
            id: booking.id,
            eventId: booking.eventId,
            seatId: booking.seatId,
            customerName: booking.customerName,
            customerPhone: booking.customerPhone,
            customerEmail: booking.customerEmail,
            totalAmount: booking.totalAmount,
            status: booking.status,
            paymentData: booking.paymentData,
            createdAt: new Date(booking.createdAt),
          },
        });
      }
    }

    console.log("🎉 تم استيراد جميع البيانات بنجاح!");
    console.log("📊 ملخص الاستيراد:");
    console.log(`   ✅ الفعاليات: ${exportedData.totalEvents}`);
    console.log(`   ✅ المقاعد: ${exportedData.totalSeats}`);
    console.log(`   ✅ الحجوزات: ${exportedData.totalBookings}`);
    console.log(`   ✅ المشرفين: ${exportedData.admins.length}`);
    console.log(`   ✅ الإعدادات: ${exportedData.settings.length}`);
  } catch (error) {
    console.error("❌ خطأ في استيراد البيانات:", error);
  } finally {
    await newPrisma.$disconnect();
  }
}

importData();
