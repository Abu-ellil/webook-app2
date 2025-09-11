"use client";

import { useRef, useState } from "react";
import { useSeatStore } from "@/lib/seat-store";
import { useCurrency } from "../CurrencyProvider";
import Seat from "./Seat";
import {
  PlusIcon,
  MinusIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

// Helper function to get seat category background color
const getSeatCategoryColor = (category: string) => {
  const colors = {
    VVIP: "#9333ea", // Purple (bg-purple-600)
    VIP: "#db2777", // Pink (bg-pink-600)
    Royal: "#16a34a", // Green (bg-green-600)
    Diamond: "#0891b2", // Cyan (bg-cyan-600)
    Platinum: "#6b7280", // Gray (bg-gray-500)
    "Gold A": "#ca8a04", // Yellow (bg-yellow-600)
    "Gold B": "#ca8a04", // Yellow (bg-yellow-600)
    Gold: "#ca8a04", // Yellow (bg-yellow-600)
    "Silver A": "#9ca3af", // Gray (bg-gray-400)
    "Silver B": "#9ca3af", // Gray (bg-gray-400)
    Silver: "#9ca3af", // Gray (bg-gray-400)
    Bronze: "#ea580c", // Orange (bg-orange-600)
  };
  return colors[category] || "#6b7280"; // Default gray
};

export default function SeatMap() {
  const { seats, zoom, panX, panY, setPan, setZoom, resetView, currentInfoSeat, setCurrentInfoSeat, toggleSeat } = useSeatStore();
  const { formatPrice } = useCurrency();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan(e.clientX - dragStart.x, e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(zoom + 0.2);
  const handleZoomOut = () => setZoom(zoom - 0.2);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(Math.max(0.5, Math.min(3, zoom + delta)));
  };

  // Touch events for mobile
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - start dragging
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panX,
        y: e.touches[0].clientY - panY,
      });
    } else if (e.touches.length === 2) {
      // Two touches - start pinch zoom
      setIsDragging(false);
      setLastTouchDistance(getTouchDistance(e.touches));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 1 && isDragging) {
      // Single touch - drag
      setPan(
        e.touches[0].clientX - dragStart.x,
        e.touches[0].clientY - dragStart.y
      );
    } else if (e.touches.length === 2) {
      // Two touches - pinch zoom
      const currentDistance = getTouchDistance(e.touches);
      if (lastTouchDistance > 0) {
        const scale = currentDistance / lastTouchDistance;
        const newZoom = Math.max(0.5, Math.min(3, zoom * scale));
        setZoom(newZoom);
      }
      setLastTouchDistance(currentDistance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouchDistance(0);
  };

  const currentSeat = currentInfoSeat ? seats.find(s => s.id === currentInfoSeat) : null;

  return (
    <div
      className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-lg"
      style={{
        backgroundColor: "#0c111f",
      }}
    >
      {/* Zoom Controls */}
      <div className="absolute bottom-10 right-4 z-10 flex flex- gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-lg transition-colors"
          title="تكبير"
        >
          <PlusIcon className="w-3 h-3" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-lg transition-colors"
          title="تصغير"
        >
          <MinusIcon className="w-3 h-3" />
        </button>
        <button
          onClick={resetView}
          className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-lg transition-colors"
          title="إعادة تعيين العرض"
        >
          <ArrowsPointingOutIcon className="w-3 h-3" />
        </button>
      </div>

      {/* Stadium Container */}
      <div
        ref={containerRef}
        className={`relative w-full h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setCurrentInfoSeat(null)}
        style={{ touchAction: "none" }}
      >
        {/* Stadium Background */}
        <div
          className="relative"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: "center center",
            width: "1000px",
            height: "800px",
            left: "80%",
            top: "30%",
            marginLeft: "-500px",
            marginTop: "-350px",
            backgroundImage: "url('/stage.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            overflow: "hidden",
          }}
        >
          {/* Stage Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: "url('/stage-overlay.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: zoom <= 1 ? 1 : 0,
              transition: "opacity 0.3s ease",
              zIndex: 1000,
              pointerEvents: zoom <= 1 ? 'auto' : 'none',
            }}
          />
          {/* Render all seats */}
          {seats.map((seat) => (
            <Seat key={seat.id} seat={seat} size={4} />
          ))}
          {currentSeat && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute rounded-lg shadow-lg overflow-hidden w-28z-50 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${currentSeat.x + 2}px`,
                top: `${currentSeat.y - 30}px`,
                backgroundColor: getSeatCategoryColor(currentSeat.category),
              }}
            >
              {/* Header with seat info */}
              <div
                className="text-white text-xs px-2 py-1 flex justify-between items-center"
                style={{
                  backgroundColor: getSeatCategoryColor(currentSeat.category),
                }}
              >
                <span className="text-xs">{formatPrice(currentSeat.price)}</span>
                <span className="font-semibold">{currentSeat.section} - {currentSeat.row}{currentSeat.number}</span>
              </div>

              {/* Buttons */}
              <div className="flex">
                <button
                  onClick={() => {
                    if (currentSeat.status === "selected") {
                      toggleSeat(currentSeat.id);
                    }
                    setCurrentInfoSeat(null);
                  }}
                  className="flex-1 bg-gray-400 text-white text-xs py-1 px-2 flex items-center justify-center gap-1 hover:bg-gray-500 transition-colors"
                >
                  <span className="text-black">👁</span>
                  <span>الغاء</span>
                </button>
                <button
                  onClick={() => {
                    toggleSeat(currentSeat.id);
                    setCurrentInfoSeat(null);
                  }}
                  className="flex-1 bg-green-500 text-white text-xs py-1 px-2 flex items-center justify-center gap-1 hover:bg-green-600 transition-colors"
                >
                  <span>✓</span>
                  <span>{currentSeat.status === "selected" ? "تم اختياره" : "موافق"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
