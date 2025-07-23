import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from '../redux/Provider';
import { Urbanist } from "next/font/google";

export const metadata: Metadata = {
  title: "Phenomenon",
  description: "This ain't what you want, Bitch I'm a fucking phenomenon.",
};

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={urbanist.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
