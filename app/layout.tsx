import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Image from "next/image";
import DynamicLogo from "@/components/dynamic-logo";
import DynamicNavbar from "@/components/dynamic-navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BotWais by Spinel",
  description: "",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="w-full h-screen flex flex-col items-center">
              <nav className="w-full fixed left-0 z-40 items-center flex justify-center h-16">
                <DynamicNavbar>
                  <div className=" flex gap-5 items-center font-semibold">
                    <DynamicLogo />
                  </div>

                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </DynamicNavbar>
              </nav>

              <div className="flex items-center justify-center w-full h-screen">
                {children}
              </div>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
