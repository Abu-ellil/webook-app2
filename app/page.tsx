"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import EventSlider from "./components/EventSlider";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  image?: string;
  time?: string;
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get gradient based on category
  const getGradientForCategory = (category: string) => {
    const gradients = {
      "حفل موسيقي": "from-purple-900 to-pink-900",
      "الحفلات الموسيقية": "from-orange-900 to-red-900",
      مسرحية: "from-blue-900 to-indigo-900",
      رياضة: "from-green-900 to-teal-900",
      كوميديا: "from-yellow-900 to-orange-900",
      ثقافي: "from-indigo-900 to-purple-900",
    };
    return (
      gradients[category as keyof typeof gradients] ||
      "from-gray-900 to-slate-900"
    );
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("🔍 Fetching events...");
        const response = await fetch("/api/events");
        console.log("📡 Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Events data received:", data.length, "events");
          setEvents(
            data.map((event: any) => ({
              ...event,
              date: new Date(event.date).toLocaleDateString("ar-SA", {
                day: "numeric",
                month: "long",
              }),
              time: new Date(event.date).toLocaleTimeString("ar-SA", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }))
          );
        } else {
          console.error(
            "❌ Failed to fetch events:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("❌ Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Group events by category
  const groupedEvents = events.reduce((acc, event) => {
    const category = event.category || "فعاليات أخرى";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Define category order with "الحفلات الموسيقية" first
  const categoryOrder = [
    "الحفلات الموسيقية",
    "حفل موسيقي",
    "مسرحية",
    "رياضة",
    "كوميديا",
    "ثقافي",
    "فعاليات أخرى",
  ];

  // Sort categories according to the defined order
  const sortedCategories = Object.keys(groupedEvents).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);

    // If category is not in the order list, put it at the end
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  return (
    <div className="min-h-screen bg-dark">
      {/* Search */}
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4 text-center">
          احجز أفضل الفعاليات والتجارب والمسرحيات
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث في webook.com"
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-4 py-3 pr-12 text-right"
          />
          <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
        </div>
        
        {/* Debug Button - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => {
                window.open('/api/diagnose', '_blank')
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              تشخيص المشاكل
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Real Events from Database */}
      <div className="px-4 space-y-6">
        {sortedCategories.map((category) => {
          const categoryEvents = groupedEvents[category];
          return (
            <div key={category} className="mb-8">
              {/* Category-specific EventSlider */}
              <EventSlider title={category} category={category} />
              {categoryEvents.map((event) => (
                <Link key={event.id} href={`/event/${event.id}`}>
                  <div className="mb-4">
                    {/* Event Image */}
                    <div
                      className={`relative bg-gradient-to-r ${getGradientForCategory(
                        event.category
                      )} rounded-lg overflow-hidden aspect-[1/1]`}
                    >
                      {/* Background Image if available */}
                      {event.image && (
                        <div
                          className="absolute inset-0 bg-cover bg-center h-full"
                          style={{ backgroundImage: `url(${event.image})` }}
                        />
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    {/* Event Details Below Image */}
                    <div className="mt-3 text-right">
                      <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-400 mb-1">
                        {event.venue}
                      </p>
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          );
        })}

        {/* Show message if no events */}
        {!loading && events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">لا توجد فعاليات متاحة حالياً</p>
            <Link
              href="/admin/login"
              className="text-primary hover:text-primary/80 text-sm"
            >
              إضافة فعالية جديدة
            </Link>
          </div>
        )}
      </div>

      {/* Writing Girl Image
      <div className="flex justify-center mt-8 mb-6">
        <Image
          src="/icons/ui/writing_girl.svg"
          alt="Writing Girl"
          width={300}
          height={300}
          className="object-contain"
        />
      </div> */}

      {/* Social Media Section */}
      <div className="px-4 mb-8">
        <p className="text-[36px] font-bold mb-6">
          Follow webook for news and latest updates
        </p>
        <div className="flex w-full items-start justify-start gap-2">
          <Link href="#" className="hover:opacity-80 transition-opacity">
            <Image
              src="/icons/social/Button-1.png"
              alt="Facebook"
              width={48}
              height={48}
              className="object-contain"
            />
          </Link>
          <Link href="#" className="hover:opacity-80 transition-opacity">
            <Image
              src="/icons/social/Button.png"
              alt="Twitter"
              width={48}
              height={48}
              className="object-contain"
            />
          </Link>
          <Link href="#" className="hover:opacity-80 transition-opacity">
            <Image
              src="/icons/social/Button-2.png"
              alt="Instagram"
              width={48}
              height={48}
              className="object-contain"
            />
          </Link>
          <Link href="#" className="hover:opacity-80 transition-opacity">
            <Image
              src="/icons/social/linkedin.png"
              alt="LinkedIn"
              width={48}
              height={48}
              className="object-contain"
            />
          </Link>
          <Link href="#" className="hover:opacity-80 transition-opacity">
            <Image
              src="/icons/social/youtube-1.png"
              alt="YouTube"
              width={48}
              height={48}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="mt-8">
          <Image
            src="/logo.gif"
            alt="WBK Logo"
            width={200}
            height={100}
            className="object-contain w-full max-w-md mx-auto"
          />
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-gray-700 my-6"></div>
      {/* Admin Link */}
      <div className="fixed bottom-4 left-4">
        <Link
          href="/admin/login"
          className="bg-gray-100/10 text-gray-800 px-1 py-1 rounded-lg text-sm backdrop-blur-sm shadow-sm"
        ></Link>
      </div>
    </div>
  );
}
