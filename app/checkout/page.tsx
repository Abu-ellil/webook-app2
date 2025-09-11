"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCurrency } from "../components/CurrencyProvider";
import { generateStadiumSeats } from "@/lib/seat-data";
import { Seat } from "@/lib/seat-store";

export default function CheckoutPage() {
  const { formatPrice } = useCurrency();
  const searchParams = useSearchParams();
  const router = useRouter();

  const eventId = searchParams.get("eventId");
  const seatsParam = searchParams.get("seats");
  const total = searchParams.get("total") || "0";

  const [event, setEvent] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7 * 60); // 7 minutes in seconds

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Redirect to main page when time expires
          router.push("/");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  useEffect(() => {
    if (!eventId) return;

    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (response.ok) {
          const eventData = await response.json();
          setEvent(eventData);
        }
      } catch (error) {
        console.error("Failed to fetch event data:", error);
      }
    };

    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    if (!seatsParam) return;

    const seats = seatsParam.split(",");
    const allSeats = generateStadiumSeats();
    const selectedSeatData = allSeats.filter((seat: Seat) =>
      seats.includes(seat.id)
    );
    setSelectedSeats(selectedSeatData);
  }, [seatsParam]);

  const handleProceedToPayment = () => {
    console.log("Button clicked!");
    console.log("agreeTerms:", agreeTerms);
    console.log("agreePrivacy:", agreePrivacy);

    if (!agreeTerms || !agreePrivacy) {
      alert("يرجى الموافقة على الشروط والأحكام وسياسة الخصوصية");
      return;
    }

    const paymentUrl = `/payment?eventId=${eventId}&seats=${seatsParam}&total=${total}`;

    console.log("Navigating to:", paymentUrl);
    router.push(paymentUrl);
  };

  const handleChangeSeats = () => {
    router.push(`/event/${eventId}`);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header with Timer and Change Seats */}
      <div className="flex justify-between items-center p-4 text-white">
        <button
          onClick={handleChangeSeats}
          className="flex items-center gap-2 text-white text-xs"
        >
          <span>تغيير المقاعد</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="text-sm">متبقي {formatTime(timeLeft)}</div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Event Info */}
        {event && (
          <div className="justify-end items-center flex">
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
              />
            )}
            <div className="">
              <h1 className="text-lg font-bold mb-2">{event.title}</h1>
              <p className="text-sm text-gray-400">
                {event.venue} •{" "}
                {new Date(event.date).toLocaleDateString("ar-SA")}
              </p>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Order Summary */}
        <div className=" rounded-lg">
          <h2 className="text-xl font-bold mb-4 ">ملخص الطلب</h2>

          {/* Tickets */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">التذاكر</h3>
            </div>
            {selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="flex justify-between items-center py-2"
              >
                <div className="flex items-center gap-2 text-right">
                  <span className="text-white text-xs">x 1</span>
                  <div className="bg-blue-800 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                    تذ
                  </div>
                  <div className="text-white text-xs">
                    الفئة {seat.category} (القسم: {seat.section} - المقعد:{" "}
                    {seat.row}
                    {seat.number})
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-8"></div>

          {/* Discount Code */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="كود الخصم"
              className="bg-black w-24 p-1  border rounded-lg text-white text-center"
            />
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-gray-700">
            <span>المجموع</span>
            <span className="text-sm">{formatPrice(parseFloat(total))}</span>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>
        {/* Payment Method */}
        <div className="rounded-lg p-4">
          <h1>اختر طريقة الدفع</h1>
          <div className="text-sm text-gray-400 mb-6">
            سوف تدفع {formatPrice(parseFloat(total))}
          </div>

          <div
            className={`border-2 rounded-lg p-4 cursor-pointer 
              paymentMethod === "credit_card border-pink-500 bg-pink-500/10"
                
            `}
            onClick={() => setPaymentMethod("credit_card")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Credit Card Icon */}
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                </svg>
                <span className="text-lg">بطاقة ائتمانية أو مدى</span>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    paymentMethod === "credit_card"
                      ? "border-pink-700 "
                      : "border-gray-400"
                  }`}
                >
                  <div className="w-4 h-4 border border-black bg-pink-700 rounded-full m-0.5"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 mt-4 mb-4">
            دفع آمن 100%
          </div>

          <div className="flex flex-row-reverse justify-center gap-4">
            <img src="/icons/mastercard.svg" alt="Mastercard" className="h-8" />
            <img src="/icons/visa.svg" alt="Visa" className="h-8" />
            <img src="/icons/apple-pay.svg" alt="Apple Pay" className="h-8" />
            <img src="/icons/mada.svg" alt="Mada" className="h-8" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Terms and Conditions */}
        <div className="p-4">
          <h3 className="font-bold mb-4 ">مهم أن تعرف</h3>

          <div className="space-y-3 text-sm">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 accent-pink-500"
              />
              <span className="text-right">
                أؤكد أنني أوافق على{" "}
                <span className="text-pink-500 underline">الشروط والأحكام</span>{" "}
                و{" "}
                <span className="text-pink-500 underline">سياسة الخصوصية</span>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="mt-1 w-4 h-4 accent-pink-500"
              />
              <span className="text-right text-xs leading-relaxed">
                أوافق على أن إعادة بيع أي تذكرة على منصة اخرى غير webook.com
                تعتبر غير نظامية، وسيترتب عليه حظر الحساب وإلغاء التذكرة وعدم
                قبول طلب استرداد التذاكر او قيمتها.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Sticky Payment Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          {/* Total Amount */}
          <div className="text-white">
            <div className="text-lg font-bold">
              {formatPrice(parseFloat(total))}
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handleProceedToPayment}
            disabled={!agreeTerms || !agreePrivacy}
            className={`px-16 py-3 rounded-lg font-bold text-lg transition-all flex items-center gap-2 ${
              !agreeTerms || !agreePrivacy
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-pink-600 hover:bg-pink-700"
            } text-white`}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
            </svg>
            الذهاب للدفع
          </button>
        </div>
      </div>
    </div>
  );
}
