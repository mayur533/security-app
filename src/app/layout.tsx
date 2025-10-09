import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import { MainLayout } from "@/components/layout/main-layout";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SafeFleet Admin Panel",
  description: "Fleet management and monitoring dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <QueryProvider>
            <MainLayout>
              {children}
            </MainLayout>
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
