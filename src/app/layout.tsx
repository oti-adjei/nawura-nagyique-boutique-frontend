import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import "./globals.css";
import Header from "@/components/common/Header"; 
import Footer from "@/components/common/Footer";
import CountryDetector from "@/components/common/CountryDetector";
import AuthProvider from "@/components/auth/AuthProvider";

// No needed again since we are not using the google font import
// const geistSans = GeistSans({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = GeistMono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Nagyique Boutique",
  description: "Explore fashion from home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <CountryDetector />
          <Header/>
           <main className=" bg-white flex-grow">
            {children}
          </main>
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
