import { Archivo_Black, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const archivo = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono"
});

export const metadata = {
  title: "Benjamin Takaki - Creative Developer",
  description:
    "Immersive portfolio of Benjamin Takaki, focused on applied AI systems, Flask products, and interactive interfaces.",
  metadataBase: new URL("https://benjamintakaki.com")
};

export const viewport = {
  themeColor: "#080A0D",
  colorScheme: "dark"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
