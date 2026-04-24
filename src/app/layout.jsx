import "./globals.scss";
import Script from "next/script";
import { CursorProvider } from "@/context/CursorProvider";
import { ScrollProvider } from "@/context/ScrollContext";
import { ToastContainer } from "react-toastify";
import { sharpGrotesk20, sharpGrotesk25, oldSchoolGrotesk } from "@/lib/fonts";
import HolidayBanner from "@/components/Common/HolidayBanner/HolidayBanner";
import { PageViewTracker } from "@/components/Common/PageViewTracker";
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
     
     <head>
        <Script
          id="meta-pixel"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');

              fbq('init', '1645166679868765');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{display:"none"}}
            src="https://www.facebook.com/tr?id=1645166679868765&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>



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
            <PageViewTracker />
            <div className="app-root-container">{children}</div>
          </ScrollProvider>
        </CursorProvider>
      </body>
    </html>
  );
}
