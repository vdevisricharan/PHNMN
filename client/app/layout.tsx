import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from '../redux/Provider';

export const metadata: Metadata = {
  title: "Phenomenon",
  description: "This ain't what you want, Bitch I'm a fucking phenomenon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
