import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import TransicionPagina from "@/components/TransicionPagina";
import NavigatorBubble from "@/components/NavigatorBubble";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: {
    default: "Iris Aerospace — Viajes Espaciales ",
    template: "%s — Iris Aerospace",
  },
  description:
    "La primera agencia de viajes espaciales privada.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  openGraph: {
    siteName: "Iris Aerospace",
    locale: "es_ES",
    type: "website",
  },
  icons: {
    icon: "/img/favicon.ico",
  },
};

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <TransicionPagina>
              <main className="flex-grow">
                {children}
              </main>
            </TransicionPagina>
            <Footer />
          </div>
          <NavigatorBubble />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}