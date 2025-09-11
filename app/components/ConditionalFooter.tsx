"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on booking, checkout, payment and confirm pages
  const hideFooterPaths = ["/book", "/checkout", "/payment", "/confirm"];
  const shouldHideFooter = hideFooterPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (shouldHideFooter) {
    return null;
  }

  return <Footer />;
}
