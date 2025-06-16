import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import '@shoelace-style/shoelace/dist/themes/light.css';
import Header from "@/components/Header";
import Script from "next/script";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Cantinho da Tia Fabi",
  description: "Venha fazer seus pedidos conosco",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable}`}>
      <head>
        <Script id="shoelace-production-mode" strategy="beforeInteractive">
          {`
            window.ENV = { NODE_ENV: 'production' };
            window.__LIT_DEV_MODE__ = false;
          `}
        </Script>
      </head>
      <body className="antialiased font-sans">
        <Providers>
          <Header />
          {children} 
        </Providers>
      </body>
    </html>
  );
}
