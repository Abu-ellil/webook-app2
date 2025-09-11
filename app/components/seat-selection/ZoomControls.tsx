"use client";

import { useSeatStore } from "@/lib/seat-store";
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowPathIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";

export default function ZoomControls() {
  const { zoom, setZoom, resetView } = useSeatStore();

  const handleZoomIn = () => setZoom(zoom * 1.2);
  const handleZoomOut = () => setZoom(zoom / 1.2);

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
      <button
        onClick={handleZoomIn}
        className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white transition-colors shadow-lg border border-gray-600"
        title="تكبير"
      >
        <MagnifyingGlassPlusIcon className="w-5 h-5" />
      </button>

      <button
        onClick={handleZoomOut}
        className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white transition-colors shadow-lg border border-gray-600"
        title="تصغير"
      >
        <MagnifyingGlassMinusIcon className="w-5 h-5" />
      </button>

      <button
        onClick={resetView}
        className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white transition-colors shadow-lg border border-gray-600"
        title="إعادة تعيين العرض"
      >
        <ArrowPathIcon className="w-5 h-5" />
      </button>

      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white text-xs border border-gray-600">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}
