"use client";

import { useEffect, useRef, useState } from "react";
import { useSeatStore } from "@/lib/seat-store";
import { useCurrency } from "@/app/components/CurrencyProvider";

interface SeatsIoMapProps {
  publicKey?: string;
  event?: string;
  chartKey?: string;
  pricing?: Array<{
    category: string;
    price: number;
  }>;
}

declare global {
  interface Window {
    seatsio: any;
  }
}

export default function SeatsIoMap({
  publicKey = "pk_test_cfb9b5a4-8b1e-4b1e-8b1e-4b1e8b1e8b1e", // Demo key - replace with your actual key
  event = "event1",
  chartKey = "sampleChart",
  pricing = [
    { category: "VVIP", price: 800 },
    { category: "VIP", price: 400 },
    { category: "Royal", price: 500 },
    { category: "Diamond", price: 600 },
    { category: "Platinum", price: 700 },
    { category: "Gold", price: 300 },
    { category: "Silver", price: 200 },
  ],
}: SeatsIoMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setSeats, selectedSeats } = useSeatStore();
  const { currency, formatPrice } = useCurrency();

  // Load seats.io script
  useEffect(() => {
    const loadSeatsIoScript = () => {
      return new Promise((resolve, reject) => {
        if (window.seatsio) {
          resolve(window.seatsio);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn-eu.seatsio.net/chart.js";
        script.async = true;
        script.onload = () => resolve(window.seatsio);
        script.onerror = () =>
          reject(new Error("Failed to load seats.io script"));
        document.head.appendChild(script);
      });
    };

    loadSeatsIoScript()
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  // Initialize chart
  useEffect(() => {
    if (!window.seatsio || !chartRef.current || isLoading) return;

    try {
      const chartInstance = new window.seatsio.SeatingChart({
        divId: chartRef.current.id,
        publicKey: publicKey,
        event: event,

        // Chart configuration
        chart: chartKey,

        // Pricing configuration
        pricing: pricing,

        // Styling and behavior
        colorScheme: "dark",
        language: "ar", // Arabic language

        // Event handlers
        onObjectSelected: (object: any) => {
          console.log("Seat selected:", object);
          // Update your seat store here
          const seatData = {
            id: object.id,
            row: object.row || "A",
            number: object.number || 1,
            section: object.section || "General",
            category: object.category || "General",
            price: getPriceForCategory(object.category),
            status: "selected" as const,
            x: 0, // seats.io handles positioning
            y: 0,
          };

          // Add to selected seats (you might need to modify your store)
          // toggleSeat(seatData.id);
        },

        onObjectDeselected: (object: any) => {
          console.log("Seat deselected:", object);
          // Remove from selected seats
          // toggleSeat(object.id);
        },

        onChartRendered: (chart: any) => {
          console.log("Chart rendered successfully");
          setChart(chart);
        },

        onChartRenderingFailed: (error: any) => {
          console.error("Chart rendering failed:", error);
          setError("Failed to render seating chart");
        },

        // Additional configuration
        showFullScreenButton: true,
        showZoomOutButtonOnMobile: true,
        showActiveSectionTooltip: true,

        // Tooltip configuration
        tooltipInfo: (object: any) => {
          const price = getPriceForCategory(object.category);
          return `${object.category} - ${formatPrice(price)}`;
        },

        // Custom styling
        style: {
          fontFamily: "Arial, sans-serif",
        },

        // Session configuration (for multi-user booking)
        session: "continue",

        // Hold token (for temporary reservations)
        holdToken: undefined,

        // Maximum number of selected seats
        maxSelectedObjects: 10,

        // Show section labels
        showSectionLabels: true,

        // Show row labels
        showRowLabels: true,

        // Colors for different seat states
        colors: {
          colorSelected: "#fbbf24", // Yellow for selected
          colorUnavailable: "#ef4444", // Red for booked
          colorAvailable: "#10b981", // Green for available
        },
      });

      setChart(chartInstance);
    } catch (err: any) {
      console.error("Error initializing seats.io chart:", err);
      setError(err.message || "Failed to initialize seating chart");
    }

    // Cleanup
    return () => {
      if (chart && chart.destroy) {
        chart.destroy();
      }
    };
  }, [isLoading, publicKey, event, chartKey]);

  const getPriceForCategory = (category: string): number => {
    const priceItem = pricing.find((p) => p.category === category);
    return priceItem ? priceItem.price : 150;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white">جاري تحميل خريطة المقاعد...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-white mb-2">خطأ في تحميل خريطة المقاعد</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Arabic Header */}
      <div className="text-center mb-4">
        <h2 className="text-white text-xl font-bold">اختر مقاعدك</h2>
        <p className="text-gray-400 text-sm">انقر على المقاعد لاختيارها</p>
      </div>

      {/* Seats.io Chart Container */}
      <div
        id="seatsio-chart"
        ref={chartRef}
        className="w-full h-[600px] bg-gray-900 rounded-lg border border-gray-700"
        style={{ minHeight: "600px" }}
      />

      {/* Legend */}
      <div className="mt-4 bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-bold mb-3">الفئات والأسعار</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pricing.map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: getCategoryColor(item.category),
                }}
              />
              <span className="text-white text-sm">
                {item.category} - {formatPrice(item.price)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-4 bg-blue-900 rounded-lg p-4">
          <h3 className="text-white font-bold mb-2">المقاعد المختارة</h3>
          <p className="text-blue-200">عدد المقاعد: {selectedSeats.length}</p>
          <p className="text-blue-200">
            المجموع: {formatPrice(selectedSeats.reduce((sum, seat) => sum + seat.price, 0))}
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to get category colors
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    VVIP: "#FFD700", // Gold
    VIP: "#FF8C00", // Orange
    Royal: "#DC143C", // Red
    Diamond: "#4169E1", // Blue
    Platinum: "#32CD32", // Green
    Gold: "#FFD700", // Yellow
    Silver: "#C0C0C0", // Silver
  };
  return colors[category] || "#808080";
}
