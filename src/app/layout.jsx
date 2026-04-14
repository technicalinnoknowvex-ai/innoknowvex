import "./globals.scss";
import { CursorProvider } from "@/context/CursorProvider";
import { ScrollProvider } from "@/context/ScrollContext";
import { ToastContainer } from "react-toastify";
import { sharpGrotesk20, sharpGrotesk25, oldSchoolGrotesk } from "@/lib/fonts";
import HolidayBanner from "@/components/Common/HolidayBanner/HolidayBanner";
import { cookies } from "next/headers";

export const metadata = {
  title: "Innoknowvex",
  description: "Transforming Aspirations into Achievements",
};

export default function RootLayout({ children }) {
  const isBannerDismissed =
    cookies().get("innoknowvex_holiday_banner_dismissed")?.value === "1";

  return (
    <html lang="en">
      <body
        className={`${sharpGrotesk20.variable} ${sharpGrotesk25.variable} ${oldSchoolGrotesk.variable}`}
      >
        <HolidayBanner initialVisible={!isBannerDismissed} />
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <CursorProvider>
          <ScrollProvider>
            {/* <Cursor /> */}
            <div className="app-root-container">{children}</div>
          </ScrollProvider>
        </CursorProvider>
      </body>
    </html>
  );
}
