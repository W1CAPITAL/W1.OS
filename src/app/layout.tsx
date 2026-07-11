import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vanquish 10 | Aston Martin OS",
  description: "Ultimate Luxury Operating System Simulation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} carbon-fiber`}>
        {children}
        <div className="scanline" />
      </body>
    </html>
  );
}