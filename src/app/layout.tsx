import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elifest",
  description: "Najjaci party",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
