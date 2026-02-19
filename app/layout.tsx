import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import ClientSidebar from "@/components/animate-ui/components/platform/sidebar/clientSidebar";
import { Toaster } from "@/components/ui/sonner";
import { WalletButton } from "@/components/ui/wallet-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { WalletProvider } from "@/context/wallet-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <ClientSidebar>
            <div className="absolute right-6 top-4 flex items-center gap-4">
              <WalletButton />
              <ThemeTogglerButton className="hover:cursor-pointer relative" />
            </div>
            {children}
          </ClientSidebar>
        </WalletProvider>
        <Toaster />

      </body>
    </html>
  );
}
