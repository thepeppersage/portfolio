import localFont from "next/font/local";
import { Instrument_Sans, Space_Mono } from "next/font/google";

export const damase = localFont({
  src: "../public/Fonts/damase-v2.ttf",
  variable: "--font-damase",
  display: "swap",
  weight: "400",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
