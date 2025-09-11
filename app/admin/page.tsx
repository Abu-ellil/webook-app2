"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useCurrency } from "../components/CurrencyProvider";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  seats?: any[];
}

export default function AdminPage() {
  const router = useRouter();
  const {
    currency,
    setCurrency,
    formatPrice,
    loading: currencyLoading,
  } = useCurrency();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: "حفل موسيقي",
    image: "",
  });

  // تصنيفات الفعاليات المتاحة
  const eventCategories = [
    "🎵 حفل موسيقي",
    "🎭 مسرحية",
    "🎪 عرض ترفيهي",
    "🏟️ حدث رياضي",
    "📚 مؤتمر",
    "🎨 معرض فني",
    "🎬 عرض سينمائي",
    "🍽️ حدث طعام",
    "👶 فعالية عائلية",
    "💼 حدث تجاري",
    "🎓 حدث تعليمي",
    "🎉 احتفال خاص",
  ];

  // أسعار فئات التذاكر - يجب تعيينها من قبل المدير
  const [ticketPrices, setTicketPrices] = useState({
    VVIP: 0,
    VIP: 0,
    Royal: 0,
    Diamond: 0,
    Platinum: 0,
    Gold: 0,
    Silver: 0,
    Bronze: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
  }, [router]);

  // Fetch events from database
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(
          data.map((event: any) => ({
            ...event,
            date: new Date(event.date).toISOString().split("T")[0],
          }))
        );
      } else {
        toast.error("فشل في تحميل الفعاليات");
      }
    } catch (error) {
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      // Try the main upload endpoint first
      let response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // If main upload fails, try alternative method
      if (!response.ok) {
        console.log("Main upload failed, trying alternative method...");
        response = await fetch("/api/upload-alternative", {
          method: "POST",
          body: formData,
        });
      }

      if (response.ok) {
        const result = await response.json();
        if (result.fallback) {
          toast.success("تم استخدام صورة بديلة مؤقتاً");
        } else {
          toast.success("تم رفع الصورة بنجاح");
        }
        return result.url;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("فشل في رفع الصورة - سيتم استخدام صورة افتراضية");

      // Return a placeholder image as fallback
      const placeholderUrl = `https://via.placeholder.com/800x600/6366f1/ffffff?text=${encodeURIComponent(
        "صورة الفعالية"
      )}`;
      return placeholderUrl;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = formData.image;

      // Upload image to Cloudinary if a new file is selected
      if (imageFile) {
        const uploadedUrl = await uploadImageToCloudinary();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // Combine date and time for the event
      const combinedDateTime = new Date(`${formData.date}T${formData.time}`)
      
      const eventData = {
        ...formData,
        date: combinedDateTime.toISOString(),
        image: imageUrl,
        ticketPrices: ticketPrices,
      };

      if (editingEvent) {
        // Update existing event
        const response = await fetch(`/api/events/${editingEvent.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });

        if (response.ok) {
          toast.success("تم تحديث الفعالية بنجاح");
          fetchEvents(); // Refresh the list
        } else {
          toast.error("فشل في تحديث الفعالية");
        }
      } else {
        // Add new event
        const response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });

        if (response.ok) {
          toast.success("تم إضافة الفعالية بنجاح");
          fetchEvents(); // Refresh the list
        } else {
          toast.error("فشل في إضافة الفعالية");
        }
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        category: "حفل موسيقي",
        image: "",
      });
      setTicketPrices({
        VVIP: 0,
        VIP: 0,
        Royal: 0,
        Diamond: 0,
        Platinum: 0,
        Gold: 0,
        Silver: 0,
        Bronze: 0,
      });
      setImageFile(null);
      setImagePreview("");
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      toast.error("خطأ في الاتصال بالخادم");
    }
  };

  const handleEdit = async (event: Event) => {
    setEditingEvent(event);
      const eventDate = new Date(event.date);
      setFormData({
        title: event.title,
        description: event.description,
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().slice(0, 5),
        venue: event.venue,
        category: event.category || "حفل موسيقي",
        image: event.image || "",
      });    // جلب أسعار التذاكر الحالية من المقاعد إذا كانت متوفرة
    if (event.seats && event.seats.length > 0) {
      const currentPrices: any = {};
      const categories = [
        "VVIP",
        "VIP",
        "Royal",
        "Diamond",
        "Platinum",
        "Gold",
        "Silver",
        "Bronze",
      ];

      categories.forEach((category) => {
        const categorySeats = event.seats!.filter(
          (seat: any) => seat.category === category
        );
        if (categorySeats.length > 0) {
          currentPrices[category] = categorySeats[0].price;
        } else {
          // لا توجد أسعار افتراضية - يجب تعيين الأسعار من قبل المدير
          currentPrices[category] = 0;
        }
      });

      setTicketPrices(currentPrices);
    } else {
      // لا توجد أسعار افتراضية - يجب تعيين الأسعار من قبل المدير
      setTicketPrices({
        VVIP: 0,
        VIP: 0,
        Royal: 0,
        Diamond: 0,
        Platinum: 0,
        Gold: 0,
        Silver: 0,
        Bronze: 0,
      });
    }

    setShowForm(true);
  };

  const handleTicketPriceChange = (category: string, price: number) => {
    setTicketPrices((prev) => ({
      ...prev,
      [category]: price,
    }));
  };

  const handleDelete = async (eventId: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الفعالية؟")) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("تم حذف الفعالية بنجاح");
          fetchEvents(); // Refresh the list
        } else {
          toast.error("فشل في حذف الفعالية");
        }
      } catch (error) {
        toast.error("خطأ في الاتصال بالخادم");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>جاري تحميل الفعاليات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-gray-800">
        {/* Top row - Title and Add button */}
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">إدارة الفعاليات</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingEvent(null);
              setFormData({
                title: "",
                description: "",
                date: "",
                time: "",
                venue: "",
                category: "حفل موسيقي",
                image: "",
              });
              setTicketPrices({
                VVIP: 0,
                VIP: 0,
                Royal: 0,
                Diamond: 0,
                Platinum: 0,
                Gold: 0,
                Silver: 0,
                Bronze: 0,
              });
            }}
            className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">إضافة فعالية</span>
            <span className="sm:hidden">إضافة</span>
          </button>
        </div>

        {/* Bottom row - Navigation */}
        <div className="flex items-center gap-4 px-4 pb-3 text-sm">
          <Link href="/" className="text-primary hover:underline">
            العودة للرئيسية
          </Link>
          <Link
            href="/admin/settings"
            className="text-gray-400 hover:text-white"
          >
            الإعدادات
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              router.push("/admin/login");
              toast.success("تم تسجيل الخروج بنجاح");
            }}
            className="flex items-center gap-1 text-gray-400 hover:text-white"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">تسجيل الخروج</span>
            <span className="sm:hidden">خروج</span>
          </button>
        </div>
      </header>

      <div className="p-4">
        {/* Currency Selection Section */}
        <div className="bg-dark-card rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            💱 تغيير عملة الموقع
          </h2>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">العملة الحالية:</label>
            <select
              value={currency.code}
              onChange={async (e) => {
                const selectedCurrency = SUPPORTED_CURRENCIES.find(
                  (c) => c.code === e.target.value
                );
                if (selectedCurrency) {
                  try {
                    await setCurrency(selectedCurrency);
                    toast.success(
                      `تم تغيير العملة إلى ${selectedCurrency.nameAr}`
                    );
                  } catch (error) {
                    toast.error("فشل في تغيير العملة");
                  }
                }
              }}
              disabled={currencyLoading}
              className="bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white min-w-[200px]"
            >
              {SUPPORTED_CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.nameAr} ({curr.symbol})
                </option>
              ))}
            </select>
            {currencyLoading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 تغيير العملة سيؤثر على جميع الأسعار في الموقع فوراً
          </p>
        </div>

        {/* Events List */}
        <div className="space-y-4 mb-8">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">لا توجد فعاليات حالياً</p>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingEvent(null);
                  setFormData({
                    title: "",
                    description: "",
                    date: "",
                    time: "",
                    venue: "",
                    category: "حفل موسيقي",
                    image: "",
                  });
                  setTicketPrices({
                    VVIP: 0,
                    VIP: 0,
                    Royal: 0,
                    Diamond: 0,
                    Platinum: 0,
                    Gold: 0,
                    Silver: 0,
                    Bronze: 0,
                  });
                }}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                إضافة أول فعالية
              </button>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-dark-card rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 text-blue-400 hover:bg-blue-400/20 rounded"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-red-400 hover:bg-red-400/20 rounded"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 mb-2">{event.description}</p>
                <div className="text-sm text-gray-500">
                  <p>التاريخ: {event.date}</p>
                  <p>المكان: {event.venue}</p>
                  <p>التصنيف: {event.category || "حفل موسيقي"}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {event.seats && event.seats.length > 0
                    ? // عرض الأسعار الفعلية من المقاعد
                      Array.from(
                        new Set(event.seats.map((seat: any) => seat.category))
                      )
                        .slice(0, 4)
                        .map((category: string) => {
                          const categorySeats = event.seats!.filter(
                            (seat: any) => seat.category === category
                          );
                          const price = categorySeats[0]?.price || 0;
                          return (
                            <span
                              key={category}
                              className="text-xs bg-primary/20 text-primary px-2 py-1 rounded"
                            >
                              {category}: {formatPrice(price)}
                            </span>
                          );
                        })
                    : // عرض الأسعار الافتراضية إذا لم توجد مقاعد
                      Object.entries(ticketPrices)
                        .slice(0, 4)
                        .map(([category, price]) => (
                          <span
                            key={category}
                            className="text-xs bg-gray-600/20 text-gray-400 px-2 py-1 rounded"
                          >
                            {category}: {formatPrice(price)}
                          </span>
                        ))}
                  {((event.seats &&
                    Array.from(
                      new Set(event.seats.map((seat: any) => seat.category))
                    ).length > 4) ||
                    (!event.seats && Object.keys(ticketPrices).length > 4)) && (
                    <span className="text-xs text-gray-400">
                      +المزيد من الفئات
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
            <div className="min-h-screen flex items-start justify-center p-4 py-8">
              <div className="bg-dark-card rounded-lg p-6 w-full max-w-2xl my-4">
                <h2 className="text-xl font-bold mb-4">
                  {editingEvent ? "تعديل الفعالية" : "إضافة فعالية جديدة"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      عنوان الفعالية
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الوصف
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        التاريخ
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        الوقت
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      المكان
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>

                  {/* تصنيف الفعالية */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      تصنيف الفعالية
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white"
                      required
                    >
                      {eventCategories.map((category) => (
                        <option
                          key={category}
                          value={category.split(" ").slice(1).join(" ")}
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      💡 اختر التصنيف المناسب لنوع الفعالية
                    </p>
                  </div>

                  {/* أسعار التذاكر */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      أسعار فئات التذاكر ({currency.nameAr})
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(ticketPrices).map(([category, price]) => (
                        <div key={category} className="space-y-1">
                          <label className="block text-xs text-gray-400">
                            {category === "VVIP" && "🏆 VVIP - الأفضل"}
                            {category === "VIP" && "💎 VIP - مميز"}
                            {category === "Royal" && "👑 Royal - ملكي"}
                            {category === "Diamond" && "💍 Diamond - الماسي"}
                            {category === "Platinum" && "🥈 Platinum - بلاتيني"}
                            {category === "Gold" && "🥇 Gold - ذهبي"}
                            {category === "Silver" && "🥈 Silver - فضي"}
                            {category === "Bronze" && "🥉 Bronze - برونزي"}
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) =>
                              handleTicketPriceChange(
                                category,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full bg-dark border border-gray-600 rounded px-2 py-1 text-white text-sm"
                            placeholder="السعر"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 يمكنك تعديل أسعار التذاكر حسب نوع الفعالية والمكان
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      صورة الفعالية (اختياري)
                    </label>

                    {/* File Upload */}
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                      />

                      {/* Image Preview */}
                      {(imagePreview || formData.image) && (
                        <div className="relative">
                          <img
                            src={imagePreview || formData.image}
                            alt="معاينة الصورة"
                            className="w-full h-32 object-cover rounded-lg border border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview("");
                              setFormData((prev) => ({ ...prev, image: "" }));
                            }}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                          >
                            ×
                          </button>
                        </div>
                      )}

                      {/* URL Input as fallback */}
                      <div className="text-center text-gray-400 text-sm">
                        أو
                      </div>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="رابط الصورة"
                        className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
                    >
                      {editingEvent ? "تحديث" : "إضافة"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingEvent(null);
                      }}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
