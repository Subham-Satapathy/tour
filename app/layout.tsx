import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Triveni Tours and Travels - Self Drive Cars, Bikes & Family Trips",
  description: "Book self-drive cars, bikes and family trips with vehicle & driver in Odisha",
  icons: {
    icon: '/favicon.ico',
  },
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
