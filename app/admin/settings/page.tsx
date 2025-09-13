"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useCurrency } from "../../components/CurrencyProvider";
import { SUPPORTED_CURRENCIES, getCurrencyByCode } from "@/lib/currency";

interface Settings {
  goldTicketPrice: string;
  silverTicketPrice: string;
  bronzeTicketPrice: string;
  vipTicketPrice: string;
  vvipTicketPrice: string;
  platformFee: string;
  taxRate: string;
  currency: string;
  supportEmail: string;
  supportPhone: string;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    goldTicketPrice: "455",
    silverTicketPrice: "350",
    bronzeTicketPrice: "250",
    vipTicketPrice: "1250",
    vvipTicketPrice: "2500",
    platformFee: "10",
    taxRate: "15",
    currency: " ",
    supportEmail: "support@example.com",
    supportPhone: "+966500000000",
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("فشل في تحميل الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update currency if it has changed
      if (settings.currency && settings.currency !== currency.code) {
        const newCurrency = getCurrencyByCode(settings.currency);
        await fetch("/api/settings/currency", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ value: settings.currency }),
        });
      }
      
      // Save other settings
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("تم حفظ الإعدادات بنجاح");
      } else {
        toast.error("فشل في حفظ الإعدادات");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>جاري تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          العودة لإدارة الفعاليات
        </Link>
        <h1 className="text-xl font-bold">إعدادات النظام</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          <CheckIcon className="w-5 h-5" />
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Ticket Prices Section */}
          <div className="bg-dark-card rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-primary">
              أسعار التذاكر الافتراضية
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              هذه الأسعار ستُستخدم كقيم افتراضية عند إنشاء فعاليات جديدة
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  🥉 تذكرة برونزية
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.bronzeTicketPrice}
                    onChange={(e) =>
                      handleInputChange("bronzeTicketPrice", e.target.value)
                    }
                    className="flex-1 bg-dark border border-gray-600 rounded-l-lg px-3 py-2 text-white"
                  />
                  <span className="bg-gray-700 border border-l-0 border-gray-600 rounded-r-lg px-3 py-2 text-gray-300 text-sm">
                    {currency.symbol}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  🥈 تذكرة فضية
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.silverTicketPrice}
                    onChange={(e) =>
                      handleInputChange("silverTicketPrice", e.target.value)
                    }
                    className="flex-1 bg-dark border border-gray-600 rounded-l-lg px-3 py-2 text-white"
                  />
                  <span className="bg-gray-700 border border-l-0 border-gray-600 rounded-r-lg px-3 py-2 text-gray-300 text-sm">
                    {currency.symbol}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  🥇 تذكرة ذهبية
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.goldTicketPrice}
                    onChange={(e) =>
                      handleInputChange("goldTicketPrice", e.target.value)
                    }
                    className="flex-1 bg-dark border border-gray-600 rounded-l-lg px-3 py-2 text-white"
                  />
                  <span className="bg-gray-700 border border-l-0 border-gray-600 rounded-r-lg px-3 py-2 text-gray-300 text-sm">
                    {currency.symbol}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  💎 تذكرة VIP
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.vipTicketPrice}
                    onChange={(e) =>
                      handleInputChange("vipTicketPrice", e.target.value)
                    }
                    className="flex-1 bg-dark border border-gray-600 rounded-l-lg px-3 py-2 text-white"
                  />
                  <span className="bg-gray-700 border border-l-0 border-gray-600 rounded-r-lg px-3 py-2 text-gray-300 text-sm">
                    {currency.symbol}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  🏆 تذكرة VVIP
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.vvipTicketPrice}
                    onChange={(e) =>
                      handleInputChange("vvipTicketPrice", e.target.value)
                    }
                    className="flex-1 bg-dark border border-gray-600 rounded-l-lg px-3 py-2 text-white"
                  />
                  <span className="bg-gray-700 border border-l-0 border-gray-600 rounded-r-lg px-3 py-2 text-gray-300 text-sm">
                    {currency.symbol}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="bg-dark-card rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-primary">
              الإعدادات المالية
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  رسوم المنصة (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.platformFee}
                  onChange={(e) =>
                    handleInputChange("platformFee", e.target.value)
                  }
                  className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  معدل الضريبة (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={(e) => handleInputChange("taxRate", e.target.value)}
                  className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  العملة
                </label>
                <select
                  value={settings.currency || currency.code}
                  onChange={(e) => handleInputChange("currency", e.target.value)}
                  className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.nameAr} ({curr.symbol})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  💡 سيتم تحديث العملة في جميع أنحاء الموقع
                </p>
              </div>
            </div>
          </div>

          {/* Contact Settings */}
          <div className="bg-dark-card rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-primary">
              معلومات الاتصال
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  بريد الدعم الإلكتروني
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    handleInputChange("supportEmail", e.target.value)
                  }
                  className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  رقم هاتف الدعم
                </label>
                <input
                  type="tel"
                  value={settings.supportPhone}
                  onChange={(e) =>
                    handleInputChange("supportPhone", e.target.value)
                  }
                  className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium"
            >
              {saving ? "جاري الحفظ..." : "حفظ جميع الإعدادات"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
