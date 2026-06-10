import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/components/ModalContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderModal from "@/components/OrderModal";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amural Cleaning — Профессиональная уборка для дома и бизнеса",
  description:
    "Профессиональный клининг в Чите. Поддерживающая уборка, генеральная уборка, уборка после ремонта, мойка окон. Звоните: +7 914 478-40-10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-[#141413] text-white`}>
        <ModalProvider>
          <Header />
          {children}
          <Footer />
          <OrderModal />
        </ModalProvider>
      </body>
    </html>
  );
}
