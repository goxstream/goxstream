import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Syne } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const fontBrand = Syne({
	subsets: ["latin"],
	weight: ["700", "800"],
	variable: "--font-brand",
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "GoxStream — Modern Anime Streaming Platform",
	description: "Stream trending anime series, latest simulcast episode drops, and movies in high bitrate 1080p with zero ad interruptions.",
	openGraph: {
		title: "GoxStream — Modern Anime Streaming Platform",
		description: "Discover trending anime, watch simulcast releases, and enjoy ad-free 1080p playback.",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} ${fontBrand.variable} antialiased bg-background text-foreground transition-colors duration-200`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
