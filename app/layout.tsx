import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Midwest Golf Car — Rental, Sales & Service in Granite City, IL",
  description:
    "Your neighborhood source for golf cart rental, sales, and service in Granite City, IL. Gas, lead acid, or lithium ion — we've got a cart for the job.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Karla:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
