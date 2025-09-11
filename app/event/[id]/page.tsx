"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import { useCurrency } from "../../components/CurrencyProvider";
import EventSlider from "../../components/EventSlider";
import Image from "next/image";

interface EventPageProps {
  params: {
    id: string;
  };
}

interface Seat {
  id: string;
  eventId: string;
  row: string;
  number: number;
  section: string;
  price: number;
  category: string;
  isBooked: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  image?: string;
  formattedDate?: string;
  formattedTime?: string;
  formattedDayOfWeek?: string;
  category?: string;
  seats?: Seat[];
}

export default function EventPage({ params }: EventPageProps) {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [bronzeTicketPrice, setBronzeTicketPrice] = useState(250); // default fallback
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (response.ok) {
          const data = await response.json();

          // Format date and time
          const eventDate = new Date(data.date);
          const formattedDate = eventDate.toLocaleDateString("ar-EG", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          const formattedTime = eventDate.toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const formattedDayOfWeek = eventDate.toLocaleDateString("ar-EG", {
            weekday: "long",
          });

          setEvent({
            ...data,
            formattedDate,
            formattedTime,
            formattedDayOfWeek,
          });
        } else {
          toast.error("فشل في تحميل بيانات الفعالية");
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
        toast.error("حدث خطأ في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id, router]);

  // Fetch bronze ticket price from settings
  useEffect(() => {
    const fetchBronzePrice = async () => {
      try {
        const response = await fetch("/api/settings/bronzeTicketPrice");
        if (response.ok) {
          const data = await response.json();
          setBronzeTicketPrice(parseInt(data.value) || 250);
        }
      } catch (error) {
        console.error("Failed to fetch bronze ticket price:", error);
      }
    };

    fetchBronzePrice();
  }, []);

  // Handle scroll to show/hide floating button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const halfScreen = windowHeight / 2;

      setShowFloatingButton(scrollY > halfScreen);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>جاري تحميل بيانات الفعالية...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">لم يتم العثور على الفعالية</p>
          <Link href="/" className="text-primary hover:underline">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const getBronzeTicketPrice = () => {
    if (!event?.seats) return bronzeTicketPrice; // use settings price as fallback
    const bronzeSeat = event.seats.find(
      (seat) => seat.category.toLowerCase() === "bronze"
    );
    return bronzeSeat ? bronzeSeat.price : bronzeTicketPrice;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black flex items-center justify-between px-4 py-3">
        <div className="flex flex-col">
          <Link href="/" className="flex flex-row">
            <div className="flex text-xs font-light gap-2">
              {event.category}{" "}
              <ChevronLeftIcon className="w-4 h-4 text-white" />
            </div>
          </Link>
          <div className="text-center ">
            <h1 className="text-xs font-light mb-2">{event.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4 border rounded-lg text-sm font-light text-gray-400 justify-center">
          <button className="flex px-2 py-1 items-center gap-2">
            {/* <ArrowUpOnSquare className="w-6 h-6 text-white" /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 28 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
              />
            </svg>
            مشاركة
          </button>
        </div>
      </div>

      {/* Event Image */}
      <div className="relative px-4 mb-6">
        <div className="w-full h- bg-gradient-to-b from-orange-400 to-purple-600 rounded-lg overflow-hidden">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-orange-400 to-purple-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {event.title}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Event Title */}
      <div className="p-4 mb-6">
        <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
        <p className="text-gray-400 text-sm">{event.venue}</p>
      </div>

      {/* Booking Section */}
      <div className="mx-4 mb-6">
        <div className=" border border-gray-700 rounded-xl p-6">
          <div className="text-right mb-6">
            <div className="text-gray-400 text-sm mb-1">بدءا من</div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatPrice(getBronzeTicketPrice())}
            </div>
            <div className="text-sm text-gray-400">
              شامل ضريبة القيمة المضافة
            </div>
          </div>
          <Link
            href={`/book/${event.id}`}
            className="block w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-center py-4 rounded-lg font-bold text-lg shadow-lg transition-all duration-200 mb-4"
          >
            احجز التذاكر
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0"
              >
                <path
                  d="M10.0782 2.16222C11.101 1.01146 12.899 1.01146 13.9218 2.16222L15.6328 4.08724C16.0011 4.50155 16.4933 4.78576 17.0362 4.89752L19.5589 5.41677C21.0669 5.72717 21.9659 7.28429 21.4807 8.74545L20.6691 11.1897C20.4944 11.7158 20.4944 12.2842 20.6691 12.8103L21.4807 15.2545C21.9659 16.7157 21.0668 18.2728 19.5589 18.5832L17.0362 19.1025C16.4933 19.2142 16.0011 19.4984 15.6328 19.9128L13.9218 21.8378C12.899 22.9885 11.101 22.9885 10.0782 21.8378L8.36719 19.9128C7.99895 19.4984 7.50668 19.2142 6.96376 19.1025L4.44114 18.5832C2.93315 18.2728 2.03415 16.7157 2.51933 15.2545L3.33095 12.8103C3.50563 12.2842 3.50563 11.7158 3.33095 11.1897L2.51933 8.74545C2.03415 7.28429 2.93315 5.72717 4.44114 5.41677L6.96376 4.89752C7.50668 4.78576 7.99895 4.50155 8.36719 4.08724L10.0782 2.16222Z"
                  fill="#FF2C79"
                  stroke="#E4E4E7"
                  stroke-width="1.5"
                ></path>
                <path
                  d="M12.416 7.72265C12.3233 7.58355 12.1672 7.5 12 7.5C11.8328 7.5 11.6767 7.58355 11.584 7.72265L9.82883 10.3554L7.22362 9.05279C7.05217 8.96706 6.8468 8.9869 6.69493 9.10386C6.54306 9.22083 6.47143 9.41432 6.51053 9.60198L7.76053 15.602C7.80883 15.8338 8.01318 16 8.25002 16H15.75C15.9869 16 16.1912 15.8338 16.2395 15.602L17.4895 9.60198C17.5286 9.41432 17.457 9.22083 17.3051 9.10386C17.1532 8.9869 16.9479 8.96706 16.7764 9.05279L14.1712 10.3554L12.416 7.72265Z"
                  fill="#E4E4E7"
                ></path>
              </svg>
            </div>
            <div>
              <span className="text-xl text-white">فعالية مميزة</span>
              <p className="text-lg">تنطبق فوائد الإشتراك على هذه الفعالية</p>
            </div>
          </div>
          <div className="mx-4 mb-6">
            <div className=" p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M15.5212 0.187988L14.1656 8.99931H21.1742L8.4788 23.8106L9.83439 14.9993H2.82578L15.5212 0.187988ZM7.17422 12.9993H12.1656L11.5212 17.188L16.8258 10.9993H11.8344L12.4788 6.81064L7.17422 12.9993Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">حجز فوري</span>
              </div>
              <p className="text-md text-gray-400">
                سيتم حجز تذكرتك مباشرة على webook.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Booking */}

      {/* Event Details */}
      <div className="mx-4 mb-6">
        <div className="border border-gray-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDaysIcon className="w-8 h-12 text-white" />
            <div className=" flex flex-col  justify-center">
              <span className="text-sm font-medium text-white">يبدأ من</span>
              <p className="text-white text-sm mb-1">
                {event.formattedDayOfWeek} - {event.formattedDate} -{" "}
                {event.formattedTime}
              </p>
            </div>
          </div>

          <div className="flex items-start justify-start gap-4 mb-3 mt-4">
            <MapPinIcon className="w-12 h-12 text-white" />
            <div className=" flex flex-col gap-2 justify-center">
              <span className="text-sm font-medium text-white">الموقع</span>
              <p className="text-white text-sm">{event.venue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold mb-3">عن الفعالية</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 m-6 p-2"></div>

      {/* Terms */}
      <div className="px-4 mb-6">
        <h3 className="text-xl font-bold mb-3">الشروط والأحكام</h3>
        <div className="space-y-2 text-xs text-gray-400">
          <p>•يجب شراء تذكرة لكل شخص منفرد (بالغ / طفل)</p>
          <p>• يُمنع التصوير والتسجيل داخل القاعة</p>
          <p>• يُرجى الحضور قبل بداية العرض بـ 30 دقيقة</p>
          <p>• يُمنع التدخين داخل المسرح</p>
        </div>
      </div>

      {/* Bottom Navigation Indicator */}
      <div className="flex justify-center pb-4">
        <div className="w-32 h-1 bg-gray-800 rounded-full"></div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Sponsors Section */}
      <div className="px-4 mb-6">
        <h3 className="text-center text-sm font-bold mb-4 text-gray-300">
          الشركاء الرسميون
        </h3>

        <div className="w-full">
          <Image
            src="/sponsers.png"
            alt="Facebook"
            width={1200}
            height={400}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 p-4"></div>
      {/* You May Like Section */}
      <EventSlider currentEventId={event.id} title="قد تعجبك أيضاً" />

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Bottom padding to prevent content from being hidden behind floating button */}
      <div className=""></div>

      {/* Floating Booking Button */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 p-4 z-50 transition-transform duration-300 ${
          showFloatingButton ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="text-right">
            <div className="text-gray-400 text-sm">بدءا من</div>
            <div className="text-white font-bold text-lg">
              {formatPrice(getBronzeTicketPrice())} 
            </div>
            <div className="text-gray-400 text-xs">
              شامل ضريبة القيمة المضافة
            </div>
          </div>
          <Link
            href={`/book/${event.id}`}
            className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-center py-4 rounded-lg font-bold text-lg shadow-lg"
          >
            احجز التذاكر
          </Link>
        </div>
      </div>
    </div>
  );
}
