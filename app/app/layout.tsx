import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seismic Quiz Bot",
  description: "Test your Seismic knowledge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
