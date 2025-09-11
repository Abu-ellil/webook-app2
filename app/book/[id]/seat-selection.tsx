"use client";

import { useEffect, useState } from "react";
import { useSeatStore } from "@/lib/seat-store";
import StageLayout from "@/app/components/seat-selection/StageLayout";

import Legend from "@/app/components/seat-selection/Legend";
import NextButton from "@/app/components/seat-selection/NextButton";
import SeatMap from "@/app/components/seat-selection/SeatMap";

interface SeatSelectionProps {
  eventId: string;
}

export default function SeatSelection({ eventId }: SeatSelectionProps) {
  const { loadSeatsForEvent, clearSelection } = useSeatStore();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Fetch event data
        const response = await fetch(`/api/events/${eventId}`);
        if (response.ok) {
          const eventData = await response.json();
          setEvent(eventData);
        }

        // Load seats with proper pricing from the store
        await loadSeatsForEvent(eventId);
      } catch (error) {
        console.error("Failed to fetch event data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();

    // Clear any previous selections when component mounts
    return () => clearSelection();
  }, [eventId, clearSelection]);

  if (loading) {
    return (
      <StageLayout eventId={eventId}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-400">جاري تحميل المقاعد...</p>
          </div>
        </div>
      </StageLayout>
    );
  }

  return (
    <StageLayout
      eventId={eventId}
      eventTitle={event?.title}
      eventVenue={event?.venue}
      eventDate={
        event?.date
          ? new Date(event.date).toLocaleDateString("ar-SA", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : undefined
      }
    >
      <div className="p-4 gap-6">
        {/* Octagonal Seat Map with Built-in Controls */}
        <div className="relative">
          <SeatMap />
        </div>

        {/* Legend */}
        <Legend />

        {/* Next Button (Fixed at bottom) */}
        <NextButton eventId={eventId} />
      </div>
    </StageLayout>
  );
}
