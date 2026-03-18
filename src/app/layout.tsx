import type { Metadata } from "next";
import "./globals.css";
import { Provider } from '@/components/ui/provider'

export const metadata: Metadata = {
  title: "Broadcom IGA Monitor - Login",
  description: "Login to the Broadcom IGA Monitor dashboard",
};

export default function RootLayout(props: { children: React.ReactNode}) {
  const { children } = props
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
