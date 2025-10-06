import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import UserProvider from './components/UserProvider';
import ClientLayoutShell from './components/ClientLayoutShell';
import "./globals.css";
import * as React from 'react';
import ClientThemeProvider from './components/ClientThemeProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instagram clone",
  description: "Created by Yassine Belkaid",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientThemeProvider>
          <UserProvider>
            <ClientLayoutShell>
              {children}
            </ClientLayoutShell>
          </UserProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
