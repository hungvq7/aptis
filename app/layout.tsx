import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const fontSans = Inter({subsets:['latin'],variable:'--font-sans'});


export const metadata: Metadata = {
  title: "Aptis Prep — Luyện thi Aptis trực tuyến",
  description: "Nền tảng luyện thi Aptis với 4 kỹ năng Nghe, Nói, Đọc, Viết theo đúng cấu trúc đề thi thật.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={fontSans.variable}>
      <body
        className="antialiased"
      >
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}