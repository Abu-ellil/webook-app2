"use client";

import { useSeatStore } from "@/lib/seat-store";
import { useCurrency } from "@/app/components/CurrencyProvider";

export default function CanvasSeatMap() {
  const { seats, toggleSeat } = useSeatStore();
  const { formatPrice } = useCurrency();

  // Group seats by category
  const seatsByCategory = seats.reduce((acc, seat) => {
    if (!acc[seat.category]) {
      acc[seat.category] = [];
    }
    acc[seat.category].push(seat);
    return acc;
  }, {} as Record<string, typeof seats>);

  const getSeatColor = (status: string, category: string) => {
    if (status === "booked") return "bg-gray-500 cursor-not-allowed";
    if (status === "selected") return "bg-green-500 border-2 border-white";

    const categoryColors = {
      VVIP: "bg-purple-500 hover:bg-purple-400",
      VIP: "bg-pink-500 hover:bg-pink-400",
      Royal: "bg-cyan-500 hover:bg-cyan-400",
      Diamond: "bg-blue-500 hover:bg-blue-400",
      Gold: "bg-yellow-500 hover:bg-yellow-400",
      Silver: "bg-gray-400 hover:bg-gray-300",
      Bronze: "bg-orange-500 hover:bg-orange-400",
    };

    return (
      categoryColors[category as keyof typeof categoryColors] ||
      "bg-gray-400 hover:bg-gray-300"
    );
  };

  return (
    <div className="w-full bg-gray-900 rounded-lg p-6">
      {/* Stage */}
      <div className="text-center mb-8">
        <div className="bg-gray-700 rounded-lg p-4 mx-auto w-64">
          <h3 className="text-white font-bold text-lg">المسرح</h3>
        </div>
      </div>

      {/* Seat Sections */}
      <div className="space-y-8">
        {Object.entries(seatsByCategory).map(([category, categorySeats]) => (
          <div key={category} className="text-center">
            <h4 className="text-white font-bold mb-4 text-lg">{category}</h4>
            <div className="grid grid-cols-15 gap-1 max-w-4xl mx-auto">
              {categorySeats.map((seat) => (
                <button
                  key={seat.id}
                  onClick={() =>
                    seat.status !== "booked" && toggleSeat(seat.id)
                  }
                  disabled={seat.status === "booked"}
                  className={`
                    w-6 h-6 rounded-sm text-xs font-bold text-white transition-all
                    ${getSeatColor(seat.status, seat.category)}
                  `}
                  title={`${seat.section} - مقعد ${seat.row}${seat.number} - ${formatPrice(seat.price)}`}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
