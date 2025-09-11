"use client";

import { useSeatStore, Seat as SeatType } from "@/lib/seat-store";
import { useState } from "react";
import { useCurrency } from "@/app/components/CurrencyProvider";

interface SeatProps {
  seat: SeatType;
  size?: number;
}

const seatColors = {
  VVIP: {
    available: "bg-pink-400 hover:bg-pink-600", // Pink/Magenta
    selected: "bg-gray-800 ring-2 ring-gray-600",
    booked: "bg-gray-600",
  },
  VIP: {
    available: "bg-red-500 hover:bg-red-400", // Red
    selected: "bg-gray-800 ring-2 ring-gray-600",
    booked: "bg-gray-600",
  },
  Royal: {
    available: "bg-green-800 hover:bg-green-400", // Green
    selected: "bg-gray-800 ring-2 ring-gray-600",
    booked: "bg-gray-600",
  },
  Diamond: {
    available: "bg-cyan-400 hover:bg-cyan-300", // Light Blue/Cyan
    selected: "bg-gray-800 ring-2 ring-gray-600",
    booked: "bg-gray-600",
  },
  Platinum: {
    available: "bg-purple-500 hover:bg-purple-400", // Purple
    selected: "bg-gray-800 ring-2 ring-gray-600",
    booked: "bg-gray-600",
  },
  Gold: {
    available: "bg-yellow-500 hover:bg-yellow-400", // Yellow/Gold
    selected: "bg-gray-800 ring-2 ring-gray-600",
    booked: "bg-gray-600",
  },
  Silver: {
    available: "bg-gray-400 hover:bg-gray-300", // Gray
    selected: "bg-gray-800 ring-2 ring-gray-600",
    booked: "bg-gray-600",
  },
  Bronze: {
    available: "bg-orange-500 hover:bg-orange-400", // Orange
    selected: "bg-gray-800 ring-2 ring-gray-600",
    booked: "bg-gray-600",
  },
};

export default function Seat({ seat, size = 6 }: SeatProps) {
  const { toggleSeat, setCurrentInfoSeat, currentInfoSeat } = useSeatStore();
  const { formatPrice } = useCurrency();

  const handleClick = (e) => {
    e.stopPropagation();
    if (seat.status === "booked") return;
    if (currentInfoSeat === seat.id) {
      setCurrentInfoSeat(null);
    } else {
      setCurrentInfoSeat(seat.id);
    }
  };

  const colorClass = seatColors[seat.category][seat.status];
  const isClickable = seat.status !== "booked";

  return (
    <button
      onClick={handleClick}
      disabled={!isClickable}
      className={`
        ${colorClass}
        rounded-full
        transition-all duration-200
        transform hover:scale-110
        ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}
        ${seat.status === "selected" ? "ring-2 ring-yellow-300 bg-green-600 scale-90" : ""}
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: "absolute",
        left: `${seat.x}px`,
        top: `${seat.y}px`,
      }}
      title={`${seat.section} - مقعد ${seat.row}${seat.number} - ${seat.category} - ${formatPrice(seat.price)}`}
    />
  );
}
