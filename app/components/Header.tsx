"use client";

import { useState } from "react";
import { Bars3Icon, ArrowUpLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-dark flex items-center justify-between p-4 border-b border-gray-800">
        <button
          className="p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="flex justify-center">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/Esports-Logo-animation-high-res-12-sec_2GIF.gif"
                alt="WBK Logo"
                width={90}
                height={60}
                className="object-contain hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1">
          <svg
            className="h-4 w-4"
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M2.35513 7.50016H4.67556C4.73114 5.93697 5.04559 4.51185 5.54223 3.43092C5.65569 3.18399 5.78308 2.94653 5.924 2.72585C3.9692 3.4959 2.54562 5.3213 2.35513 7.50016ZM8.00004 1.3335C4.31814 1.3335 1.33337 4.31826 1.33337 8.00016C1.33337 11.6821 4.31814 14.6668 8.00004 14.6668C11.6819 14.6668 14.6667 11.6821 14.6667 8.00016C14.6667 4.31826 11.6819 1.3335 8.00004 1.3335ZM8.00004 2.3335C7.53142 2.3335 6.94712 2.76844 6.45091 3.84842C6.02333 4.77904 5.7315 6.05665 5.67623 7.50016H10.3238C10.2686 6.05665 9.97675 4.77904 9.54917 3.84842C9.05296 2.76844 8.46866 2.3335 8.00004 2.3335ZM11.3245 7.50016C11.2689 5.93697 10.9545 4.51185 10.4578 3.43092C10.3444 3.18399 10.217 2.94653 10.0761 2.72585C12.0309 3.4959 13.4545 5.3213 13.645 7.50016H11.3245ZM10.3238 8.50016H5.67623C5.7315 9.94368 6.02333 11.2213 6.45091 12.1519C6.94712 13.2319 7.53142 13.6668 8.00004 13.6668C8.46866 13.6668 9.05296 13.2319 9.54917 12.1519C9.97675 11.2213 10.2686 9.94368 10.3238 8.50016ZM10.0761 13.2745C10.217 13.0538 10.3444 12.8163 10.4578 12.5694C10.9545 11.4885 11.2689 10.0634 11.3245 8.50016H13.645C13.4545 10.679 12.0309 12.5044 10.0761 13.2745ZM5.92401 13.2745C5.78308 13.0538 5.65569 12.8163 5.54223 12.5694C5.04559 11.4885 4.73114 10.0634 4.67556 8.50016H2.35513C2.54562 10.679 3.9692 12.5044 5.92401 13.2745Z"
              fill="currentColor"
              fillRule="evenodd"
            ></path>
          </svg>
          <div className="w-[1px] h-4 bg-gray-600"></div>
          <span className="text-sm">GLOBAL</span>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 inset-0 bg-dark-lighter z-50 flex flex-col">
          {/* Menu Content */}
          <div className="flex-1 p-6 text-right">
            {/* فعاليات webook.co */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-3 text-white">
                فعاليات webook.co
              </h2>
              <div className="flex space-y-6 flex-col items-start justify-start">
                <Link
                  href="/"
                  className="flex items-center justify-end gap-2 text-xs text-gray-300 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>احجز أفضل الفعاليات من روح السعودية</span>
                  <ArrowUpLeftIcon className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-end gap-2 text-xs text-gray-300 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>سباق جائزة السعودية الكبرى STC لعام 2024</span>
                  <ArrowUpLeftIcon className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-end gap-2 text-xs text-gray-300 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>الأول بارك</span>
                  <ArrowUpLeftIcon className="w-5 h-5 text-white" />
                </Link>
              </div>
            </div>
            {/* Divider */}
            <div className="border-t border-gray-700 my-6"></div>
            {/* اكتشف موسم الرياض */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-3 text-white">
                اكتشف موسم الرياض
              </h2>
              <Link
                href="/"
                className="block text-xs text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                احجز فعاليات وتجارب
              </Link>
            </div>
            {/* Divider */}
            <div className="border-t border-gray-700 my-6"></div>
            {/* webook.com للأعمال */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-3 text-white">
                webook.com للأعمال
              </h2>
              <div className="space-y-6">
                <Link
                  href="/"
                  className="block text-xs text-gray-300 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  الإعلان على webook
                </Link>
                <Link
                  href="/"
                  className="block text-xs text-gray-300 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  أسئلة متكررة
                </Link>
              </div>
            </div>
            {/* Divider */}
            <div className="border-t border-gray-700 my-6"></div>
            {/* تواصل معنا */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-3 text-white">
                تواصل معنا
              </h2>
              <div className="space-y-6">
                <Link
                  href="/"
                  className="block text-xs text-gray-300 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  سياسة الخصوصية
                </Link>
                <Link
                  href="/"
                  className="block text-xs text-gray-300 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  شروط الاستخدام
                </Link>
              </div>
            </div>
            {/* Divider */}
            <div className="border-t border-gray-700 my-6"></div>
            {/* تابعنا على */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-3 text-white">
                تابعنا على
              </h2>
              <div className="flex flex-row-reverse justify-end gap-4">
                <Link
                  href="/"
                  className="hover:opacity-80 transition-opacity"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Image
                    src="/icons/social/youtube-1.png"
                    alt="YouTube"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </Link>
                <Link
                  href="/"
                  className="hover:opacity-80 transition-opacity"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Image
                    src="/icons/social/linkedin.png"
                    alt="LinkedIn"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </Link>
                <Link
                  href="/"
                  className="hover:opacity-80 transition-opacity"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Image
                    src="/icons/social/Button-2.png"
                    alt="Instagram"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </Link>
                <Link
                  href="/"
                  className="hover:opacity-80 transition-opacity"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Image
                    src="/icons/social/Button.png"
                    alt="Twitter"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </Link>
                <Link
                  href="/"
                  className="hover:opacity-80 transition-opacity"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Image
                    src="/icons/social/Button-1.png"
                    alt="Facebook"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
