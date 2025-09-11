"use client";

import { useEffect } from "react";
import { useSeatStore } from "@/lib/seat-store";
import SeatMap from "./SeatMap";

interface SeatMapWithEventProps {
  eventId: string;
}

export default function SeatMapWithEvent({ eventId }: SeatMapWithEventProps) {
  const { loadSeatsForEvent, seats } = useSeatStore();

  useEffect(() => {
    if (eventId) {
      // Load seats with dynamic pricing from the database
      loadSeatsForEvent(eventId);
    }
  }, [eventId, loadSeatsForEvent]);

  return (
    <div>
      {seats.length > 0 ? (
        <SeatMap />
      ) : (
        <div className="flex items-center justify-center h-[400px] sm:h-[500px] lg:h-[600px] bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading seats...</p>
          </div>
        </div>
      )}
    </div>
  );
}
