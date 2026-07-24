import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Desmond Iorfa | Master Carpenter and Bespoke Furniture",
  description:
    "Handcrafted furniture by Desmond Iorfa, master carpenter and furniture maker. Bespoke sofas, bed frames, dining tables, wardrobes and mirror frames built to last a lifetime.",
  keywords: "Desmond Iorfa, carpenter Nigeria, bespoke furniture, handcrafted furniture Abuja, mahogany furniture",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
