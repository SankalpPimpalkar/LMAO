import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "LMAO - Upvote Royale",
    description: "Meme battle platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark h-full bg-zinc-950">
            <body className={`${inter.className} h-full overflow-y-scroll antialiased`}>
                {children}
            </body>
        </html>
    );
}
