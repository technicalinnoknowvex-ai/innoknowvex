import "./globals.scss";
import { CursorProvider } from "@/context/CursorProvider";
import Cursor from "@/components/Common/Cursor/Cursor";
import { ScrollProvider } from "@/context/ScrollContext";
import { ToastContainer } from "react-toastify";
import { sharpGrotesk20, sharpGrotesk25, oldSchoolGrotesk } from "@/lib/fonts";

export const metadata = {
  title: "Innoknowvex",
  description: "Transforming Aspirations into Achievements",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sharpGrotesk20.variable} ${sharpGrotesk25.variable} ${oldSchoolGrotesk.variable}`}
      >
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
            <Cursor />
            <div className="app-root-container">{children}</div>
          </ScrollProvider>
        </CursorProvider>
      </body>
    </html>
  );
}
