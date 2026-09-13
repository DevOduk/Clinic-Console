import { Geist, Geist_Mono, Outfit } from "next/font/google";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <UserProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.className} h-full antialiased`}
      >
        <body suppressHydrationWarning className="min-h-full flex flex-col">
          {children}
        </body>
      </html>
    </UserProvider>
  );
}
