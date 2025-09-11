"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Hide header on booking, checkout, payment and confirm pages
  const hideHeaderPaths = ["/book", "/checkout", "/payment", "/confirm"];
  const shouldHideHeader = hideHeaderPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (shouldHideHeader) {
    return null;
  }

  return <Header />;
}
