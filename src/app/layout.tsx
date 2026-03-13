import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import Navigation from "@/components/layout/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Choitame - 検証プラットフォーム",
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

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 p-6 text-center text-sm text-slate-500">
          &copy; 2026 Choitame. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
