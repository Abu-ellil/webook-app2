import Image from "next/image";
import Link from "next/link";


export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Links Column 1 */}
          <div className="space-y-4">
            <Link
              href="/jobs"
              className="block text-gray-300 hover:text-white transition-colors"
            >
              فرص وظيفية
            </Link>
            <Link
              href="/contact"
              className="block text-gray-300 hover:text-white transition-colors"
            >
              تواصل معنا
            </Link>
            <Link
              href="/advertise"
              className="block text-gray-300 hover:text-white transition-colors"
            >
              الإعلان على webook
            </Link>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-4">
            <Link
              href="/privacy"
              className="block text-gray-300 hover:text-white transition-colors"
            >
              سياسة الخصوصية
            </Link>
            <Link
              href="/terms"
              className="block text-gray-300 hover:text-white transition-colors"
            >
              شروط الاستخدام
            </Link>
            <Link
              href="/faq"
              className="block text-gray-300 hover:text-white transition-colors"
            >
              أسئلة متكررة
            </Link>
          </div>

          {/* Links Column 3 */}
          <div className="space-y-4">
            <Link
              href="/about"
              className="block text-gray-300 hover:text-white transition-colors"
            >
              عن ويبوك
            </Link>
            <Link
              href="/startup-fund"
              className="block text-gray-300 hover:text-white transition-colors"
            >
              صندوق تسريع الشركات الناشئة
            </Link>
            <Link
              href="/blog"
              className="block text-gray-300 hover:text-white transition-colors"
            >
              مدونة ويبوك
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* App Download Section */}
        <div className="text-center mb-8">
          <h3 className="text-sm mb-6">حمل تطبيق webook.com الآن</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="#" className="block">
              <Image
                src="/icons/app-store.svg"
                alt="App Store"
                width={120}
                height={40}
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
            <Link href="#" className="block">
              <Image
                src="/icons/google-play.svg"
                alt="Google Play"
                width={120}
                height={40}
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
            <Link href="#" className="block">
              <Image
                src="/icons/huawei_app.svg"
                alt="AppGallery"
                width={120}
                height={40}
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Payment Methods */}
        <div className="text-center mb-8">
          <h3 className="text-sm text-gray-500 mb-2">خيارات دفع متعددة</h3>
          <div className="flex justify-center gap-1 flex-wrap items-center">
            <div className=" rounded px-1 py-2 flex items-center justify-center">
              <Image
                src="/icons/mada.svg"
                alt="مدى"
                width={32}
                height={22}
                className="object-contain"
              />
            </div>
            <div className=" rounded px-1 py-2 flex items-center justify-center">
              <Image
                src="/icons/apple-pay.svg"
                alt="Apple Pay"
                width={32}
                height={22}
                className="object-contain"
              />
            </div>
            <div className=" rounded px-1 py-2 flex items-center justify-center">
              <Image
                src="/icons/visa.svg"
                alt="Visa"
                width={32}
                height={22}
                className="object-contain"
              />
            </div>
            <div className=" rounded px-1 py-2 flex items-center justify-center">
              <Image
                src="/icons/mastercard.svg"
                alt="Mastercard"
                width={32}
                height={22}
                className="object-contain"
              />
            </div>
            <div className=" rounded px-1 py-1 flex items-center justify-center">
              <Image
                src="/icons/american-express.svg"
                alt="American Express"
                width={26}
                height={2}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Currency and Copyright */}
          <div className="flex flex-row-reverse items-center justify-between w-full  gap-4">
            <div className="flex items-center gap-2">
              <div className=" flex items-center justify-center gap-1">
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
                <div className="bg-slate-400 w-0.5 h-4"></div>
              </div>
            </div>
            <div className="flex flex-row-reverse gap-4">
              <span className="text-xs text-white">© webook.com 2024 </span>
              <div className="text-pink-500 font-bold">
                <Image
                  src="/loogo.svg"
                  alt="Facebook"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex w-full gap-2 items-start justify-start">
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
                alt="x"
                width={48}
                height={48}
                className="object-contain"
              />
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Image
                src="/icons/social/Button-2.png"
                alt="Social Media"
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
        </div>
      </div>
    </footer>
  );
}
