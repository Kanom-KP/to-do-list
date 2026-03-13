import type { Metadata } from "next";
import { Playpen_Sans_Thai } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const playpenSansThai = Playpen_Sans_Thai({
  variable: "--font-playpen-sans-thai",
  subsets: ["latin", "thai"],
});

export const metadata: Metadata = {
  title: "TaskFlow – To-Do List",
  description: "Manage your tasks with clear priority and due-date visibility",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('taskflow-theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');})();`,
          }}
        />
      </head>
      <body
        className={`${playpenSansThai.variable} ${playpenSansThai.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
