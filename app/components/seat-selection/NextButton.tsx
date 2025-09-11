"use client";

import { useSeatStore } from "@/lib/seat-store";
import Link from "next/link";
import { useCurrency } from "@/app/components/CurrencyProvider";

interface NextButtonProps {
  eventId: string;
}

export default function NextButton({ eventId }: NextButtonProps) {
  const { selectedSeats, getTotalPrice, getSelectedCount } = useSeatStore();
  const { formatPrice } = useCurrency();

  const totalPrice = getTotalPrice();
  const selectedCount = getSelectedCount();
  const isDisabled = selectedCount === 0;

  if (selectedCount === 0) {
    return null;
  }

  const seatIds = selectedSeats.map((seat) => seat.id).join(",");
  const checkoutUrl = `/checkout?eventId=${eventId}&seats=${seatIds}&total=${totalPrice}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-50">
      {/* Selected Seats Summary */}
      <div className="mb-4 max-h-32 overflow-y-auto">
        <h3 className="font-bold mb-2 text-sm">
          التذاكر المختارة ({selectedCount})
        </h3>
        <div className="space-y-1">
          {selectedSeats.map((seat) => (
            <div
              key={seat.id}
              className="flex justify-between text-sm bg-gray-800 p-2 rounded"
            >
              <span>
                {seat.section} - مقعد {seat.row}
                {seat.number} - {seat.category}
              </span>
              <span className="font-medium">{formatPrice(seat.price)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total and Next Button */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <div className="text-xl font-bold text-white">
            {formatPrice(totalPrice)}
          </div>
        </div>

        <Link
          href={checkoutUrl}
          className={`
            flex items-center gap-2 w-1/2 justify-center py-3 rounded-lg font-bold text-lg transition-all
            ${
              isDisabled
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-300 text-black shadow-lg hover:shadow-xl"
            }
          `}
        >
          <span>التالي: الدفع</span>
        </Link>
      </div>
    </div>
  );
}
