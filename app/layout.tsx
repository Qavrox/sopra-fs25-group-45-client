import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConfigProvider, theme } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Group 45",
  description: "sopra-fs25-template-client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              // general theme options are set in token, meaning all primary elements (button, menu, ...) will have this color
              colorPrimary: "#22426b", // selected input field boarder will have this color as well
              colorText: "#ffffff",
              colorBgContainer: "#16181D",
              // For popups (dropdowns, pickers, etc.)
              colorBgElevated: "#1E1E24",
              borderRadius: 8,
              fontSize: 16,
            },
            components: {
              DatePicker: {
                colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
                colorText: "#ffffff",
                colorTextDisabled: "rgba(255, 255, 255, 0.25)",
                colorIcon: "#ffffff",
                colorIconHover: "#ffffff",
              },
              Input: {
                colorText: "#ffffff",
                colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
                colorTextDisabled: "rgba(255, 255, 255, 0.25)",
              },
              Select: {
                colorText: "#ffffff",
                colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
                colorTextDisabled: "rgba(255, 255, 255, 0.25)",
                optionSelectedColor: "#ffffff",
              },
              Button: {
                colorText: "#ffffff",
              },
            },
          }}
        >
          <AntdRegistry>{children}</AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
