import type { Metadata } from 'next';
import { DM_Sans, Caveat, Space_Mono, Pixelify_Sans } from 'next/font/google';
import './globals.css';
const body = DM_Sans({ variable: '--font-body', subsets: ['latin'] });
const hand = Caveat({ variable: '--font-hand', subsets: ['latin'] });
const mono = Space_Mono({ variable: '--font-mono', weight: ['400'], subsets: ['latin'] });
const pixel = Pixelify_Sans({ variable: '--font-pixel', subsets: ['latin'] });
export const metadata: Metadata = { title: 'Franyel — Code, color & curiosity', description: 'Franyel Diaz Rodriguez. Developer, visual thinker, and an artist in progress. Explore selected web projects and a growing creative practice.', metadataBase: new URL('https://franyel-studio.franyel1.chatgpt.site'), icons: { icon: '/favicon.svg' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${body.variable} ${hand.variable} ${mono.variable} ${pixel.variable}`}>{children}</body></html>; }
