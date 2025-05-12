import type { Metadata } from "next";
import { Inter } from "next/font/google"; // <- Inter z next/font
import "./globals.css";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
import ChatWidget from "@/components/chatAi/ChatWidget";
import { UserProvider } from "@/contexts/UserContext";
import CookieModal from "@/components/CookieModal";

// Import czcionki Inter
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Barter Exchange App",
  description: "Barter Exchange App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html >
      <body className={`${inter.variable} font-sans antialiased`}>
      <UserProvider>
        <Header />
        {children}
        <CookieModal />
        <ChatWidget />
        <Footer />
      </UserProvider>
      </body>
    </html>
  );
}


