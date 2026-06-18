import "./globals.scss";
import Script from "next/script";
import { CursorProvider } from "@/context/CursorProvider";
import { ScrollProvider } from "@/context/ScrollContext";
import { ToastContainer } from "react-toastify";
import { sharpGrotesk20, sharpGrotesk25, oldSchoolGrotesk } from "@/lib/fonts";
import BannerWrapper from "@/components/Common/BannerWrapper";
import { PageViewTracker } from "@/components/Common/PageViewTracker";
import { cookies } from "next/headers";
import { generateMetadataObject, createOrganizationSchema } from "@/utils/seo";
import { SITE_CONFIG, PAGES, DEFAULT_OG_IMAGE } from "@/constants/seo";

export const metadata = generateMetadataObject({
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  keywords: [
    "web development",
    "MERN stack",
    "cyber security",
    "internships",
    "placement training",
    "tech education",
    "coding courses",
    "professional training",
  ],
  image: DEFAULT_OG_IMAGE,
  path: "/",
  type: "website",
});

export default function RootLayout({ children }) {
  const isBannerDismissed =
    cookies().get("innoknowvex_holiday_banner_dismissed")?.value === "1";

  return (
    <html lang="en">
     
     <head>
        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(createOrganizationSchema()),
          }}
        />

        {/* Facebook Meta Pixel */}
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
            alt="Facebook pixel"
          />
        </noscript>

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </head>

      <body
        className={`${sharpGrotesk20.variable} ${sharpGrotesk25.variable} ${oldSchoolGrotesk.variable}`}
      >
        <BannerWrapper initialVisible={!isBannerDismissed} />
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
