import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
    variable: "--font-display",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Tracking Mania",
    description: "Master the art of web analytics.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${spaceGrotesk.variable} font-display antialiased`}
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    );
}
