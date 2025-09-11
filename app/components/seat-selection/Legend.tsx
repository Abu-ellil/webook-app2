"use client";

import { useSeatStore } from "@/lib/seat-store";
import { formatCurrency } from "@/lib/currency";
import { useCurrency } from "@/app/components/CurrencyProvider";

const categoryInfo = {
  VVIP: { color: "bg-purple-600", icon: "", name: "VVIP " },
  VIP: { color: "bg-pink-600", icon: "", name: "VIP" },
  Royal: { color: "bg-green-600", icon: "", name: "Royal " },
  Diamond: { color: "bg-cyan-600", icon: "", name: "Diamond - الماسي" },
  Platinum: { color: "bg-gray-500", icon: "", name: "Platinum - بلاتيني" },
  Gold: { color: "bg-yellow-600", icon: "", name: "Gold " },
  Silver: { color: "bg-gray-400", icon: "", name: "Silver" },
  Bronze: { color: "bg-orange-600", icon: "", name: "Bronze - برونزي" },
};

export default function Legend() {
  const { seats } = useSeatStore();
  const { formatPrice } = useCurrency();

  console.log("seats", seats[2].category);

  // Get unique categories from seats
  const availableCategories = Array.from(
    new Set(seats.map((seat) => seat.category))
  ).sort((a, b) => {
    const order = [
      "VVIP",
      "VIP",
      "Royal",
      "Diamond",
      "Platinum",
      "Gold",
      "Silver",
      "Bronze",
    ];
    return order.indexOf(a) - order.indexOf(b);
  });

  const getCategoryStats = (category: string) => {
    const categorySeats = seats.filter((seat) => seat.category === category);
    const available = categorySeats.filter(
      (seat) => seat.status === "available"
    ).length;
    const selected = categorySeats.filter(
      (seat) => seat.status === "selected"
    ).length;
    const booked = categorySeats.filter(
      (seat) => seat.status === "booked"
    ).length;

    const prices = categorySeats.map((seat) => seat.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return { available, selected, booked, minPrice, maxPrice };
  };

  return (
    <div className="p-4  rounded-lg">
      <div className="space-y-3">
        {availableCategories.map((category) => {
          const info = categoryInfo[category as keyof typeof categoryInfo];
          const stats = getCategoryStats(category);

          return (
            <div key={category} className="flex items-center gap-2 p-3 ">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-6  ${info.color}`}></div>
                <div>
                  <div className="font-medium text-sm">
                    {info.icon} {info.name}
                  </div>
                </div>
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">
                  {stats.minPrice === stats.maxPrice
                    ? `(${formatPrice(stats.minPrice)})`
                    : `${formatPrice(stats.minPrice)} - ${formatPrice(stats.maxPrice)}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
