"use client";

import { useState, useEffect } from "react";
import SeatMapWithEvent from "./SeatMapWithEvent";
import { useSeatStore } from "@/lib/seat-store";
import { useCurrency } from "@/app/components/CurrencyProvider";

interface EventSeatSelectionProps {
  eventId: string;
  eventTitle?: string;
}

export default function EventSeatSelection({
  eventId,
  eventTitle = "Event",
}: EventSeatSelectionProps) {
  const { selectedSeats, getTotalPrice, getSelectedCount } = useSeatStore();
  const [categoryPrices, setCategoryPrices] = useState<Record<string, number>>(
    {}
  );
  const { formatPrice } = useCurrency();

  // Fetch category prices for display
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/pricing`);
        const data = await response.json();

        if (data.success && data.categoryPrices) {
          setCategoryPrices(data.categoryPrices);
        }
      } catch (error) {
        console.error("Error fetching category prices:", error);
      }
    };

    if (eventId) {
      fetchPrices();
    }
  }, [eventId]);

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{eventTitle}</h1>
        <p className="text-gray-600">Select your seats</p>
      </div>

      {/* Pricing Legend */}
      {Object.keys(categoryPrices).length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Ticket Prices</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(categoryPrices)
              .sort(([, a], [, b]) => b - a) // Sort by price descending
              .map(([category, price]) => (
                <div key={category} className="flex items-center space-x-2">
                  <div
                    className={`w-4 h-4 rounded-full ${getCategoryColor(
                      category
                    )}`}
                  ></div>
                  <span className="text-sm">
                    <span className="font-medium">{category}</span>
                    <br />
                    <span className="text-gray-600">{formatPrice(price)}</span>
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Seat Map */}
      <SeatMapWithEvent eventId={eventId} />

      {/* Selection Summary */}
      {getSelectedCount() > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-blue-900">
                Selected Seats: {getSelectedCount()}
              </p>
              <p className="text-blue-700">
                Total: {formatPrice(getTotalPrice())}
              </p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Continue to Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get category colors (matches your seat colors)
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    VVIP: "bg-pink-500",
    VIP: "bg-red-500",
    Royal: "bg-green-500",
    Diamond: "bg-cyan-400",
    Platinum: "bg-purple-500",
    Gold: "bg-yellow-500",
    Silver: "bg-gray-400",
    Bronze: "bg-orange-500",
  };

  return colors[category] || "bg-gray-300";
}
