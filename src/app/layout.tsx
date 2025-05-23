import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

// Load the Inter font from Google Fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insurance Claim Parser",
  description: "SWE Take Home Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
