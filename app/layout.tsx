import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tour Booking - Car & Bike Rentals",
  description: "Book cars and bikes for your travel needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
