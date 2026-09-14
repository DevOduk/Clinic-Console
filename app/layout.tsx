import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { UserProvider } from "./context/userContext";

const outfit = Outfit({
  subsets: ["latin"],
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.className} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <UserProvider>{children}</UserProvider>
        </Suspense>
      </body>
    </html>
  );
}
