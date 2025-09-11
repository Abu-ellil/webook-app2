"use client";

import { ReactNode } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface StageLayoutProps {
  children: ReactNode;
  eventId: string;
  eventTitle?: string;
  eventVenue?: string;
  eventDate?: string;
}

export default function StageLayout({
  children,
  eventId,
  eventTitle,
  eventVenue,
  eventDate,
}: StageLayoutProps) {
  return (
    <div className="min-h-screen  text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <Link
          href={`/event/${eventId}`}
          className="p-2 hover:bg-gray-800 rounded-lg"
        >
          <ArrowRightIcon className="w-6 h-6" />
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-bold">اختر التذاكر</h1>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Event Info */}
      {(eventTitle || eventVenue || eventDate) && (
        <div className="p-4 border-b border-gray-800 ">
          {eventTitle && (
            <h2 className="font-bold text-xl mb-2">{eventTitle}</h2>
          )}
          {(eventVenue || eventDate) && (
            <p className="text-sm text-gray-400">
              {eventVenue && <span>{eventVenue}</span>}
              {eventVenue && eventDate && <span> - </span>}
              {eventDate && <span>{eventDate}</span>}
            </p>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
