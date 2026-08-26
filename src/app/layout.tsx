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
	icons: {
		icon: [
			{ url: "/favicon.ico" },
			{ url: "/logo.svg", type: "image/svg+xml" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
		apple: [
			{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
		],
	},
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
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="icon" href="/logo.svg" type="image/svg+xml" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
