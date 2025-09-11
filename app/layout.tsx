import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { CurrencyProvider } from "./components/CurrencyProvider";
import ConditionalHeader from "./components/ConditionalHeader";
import ConditionalFooter from "./components/ConditionalFooter";

export const metadata: Metadata = {
  title: "حجز الفعاليات - Event Booking",
  description: "احجز تذاكرك للفعاليات والمسرحيات",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark text-white font-vazir">
        <CurrencyProvider>
          <ConditionalHeader />
          {children}
          <ConditionalFooter />
          <Toaster position="top-center" />
        </CurrencyProvider>
      </body>
    </html>
  );
}
