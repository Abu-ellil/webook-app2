"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCurrency } from "./CurrencyProvider";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  image?: string;
  category?: string;
  seats?: Array<{
    category: string;
    price: number;
  }>;
}

interface EventSliderProps {
  currentEventId?: string;
  title?: string;
  category?: string;
}

export default function EventSlider({
  currentEventId,
  title = "قد تعجبك أيضاً",
  category,
}: EventSliderProps) {
  const { formatPrice } = useCurrency();
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const allEvents = await response.json();

          // Filter out current event and filter by category if provided
          let filteredEvents = allEvents.filter(
            (event: Event) => event.id !== currentEventId
          );

          // Filter by category if specified
          if (category) {
            filteredEvents = filteredEvents.filter(
              (event: Event) => event.category === category
            );
          }

          // Shuffle and take first 5 events
          const shuffled = filteredEvents.sort(() => 0.5 - Math.random());
          setEvents(shuffled.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentEventId, category]);

  // Auto-advance slider every 3 seconds
  useEffect(() => {
    if (events.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % events.length);
      }, 3000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [events.length]);

  const getMinPrice = (event: Event) => {
    if (!event.seats || event.seats.length === 0) return 250;
    return Math.min(...event.seats.map((seat) => seat.price));
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    return { day, month };
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-6 ">{title}</h3>
        <div className="w-full h-96 bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  const currentEvent = events[currentIndex];

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-6 p-2">{title}</h3>

      <div className="relative w-full h-96 overflow-hidden rounded-lg">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          {currentEvent.image ? (
            <img
              src={currentEvent.image}
              alt={currentEvent.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900"></div>
          )}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-25 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
          <h4 className="text-white text-2xl font-bold mb-2 text-right">
            {currentEvent.title}
          </h4>
          <div className="flex justify-between items-center text-white/80">
            <span className="text-sm">{currentEvent.venue}</span>
            <span className="text-sm">
              {formatEventDate(currentEvent.date).day}{" "}
              {formatEventDate(currentEvent.date).month}
            </span>
          </div>
        </div>

        {/* Navigation Arrows */}
        {events.length > 1 && (
          <>
            {/* Left Arrow */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="الحدث السابق"
            >
              <svg
                className="w-6 h-6"
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

            {/* Right Arrow */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="الحدث التالي"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Click overlay to navigate to event */}
        <Link
          href={`/event/${currentEvent.id}`}
          className="absolute inset-0 z-20"
        >
          <span className="sr-only">عرض تفاصيل {currentEvent.title}</span>
        </Link>
      </div>

      {/* Dots Indicator */}
      {events.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-pink-500" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
