import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "~/styles/globals.css";
import Navbar from "~/components/navbar";
import { Toaster } from "~/components/ui/toaster";
import { TRPCReactProvider } from "~/trpc/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  authModal,
}: Readonly<{
  children: React.ReactNode;
  authModal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <TRPCReactProvider>
          <Navbar />
          <main className="min-h-screen h-full w-full">
            {children}
            {authModal}
          </main>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
