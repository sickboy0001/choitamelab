import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import Navigation from "@/components/layout/Navigations";
import Footer from "@/components/layout/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChoitameLab - 検証プラットフォーム",
  description: "依頼と報告で検証を加速させる",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const signOutAction = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  const signInAction = async () => {
    "use server";
    await signIn();
  };

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation
          session={session}
          signOutAction={signOutAction}
          signInAction={signInAction}
        >
          {/* Main Content */}
          <main className="flex-1 bg-white">{children}</main>
        </Navigation>

        <Footer />
        <GoogleAnalytics gaId="G-NJ2V7CT80L" />
      </body>
    </html>
  );
}
