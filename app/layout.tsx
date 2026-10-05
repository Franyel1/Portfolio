import type { Metadata } from 'next';
import { DM_Sans, Caveat, Space_Mono, Pixelify_Sans } from 'next/font/google';
import './globals.css';
import './polish.css';
import './editorial.css';
import './navigation.css';
import './atelier.css';
const body = DM_Sans({ variable: '--font-body', subsets: ['latin'] });
const hand = Caveat({ variable: '--font-hand', subsets: ['latin'] });
const mono = Space_Mono({
  variable: '--font-mono',
  weight: ['400'],
  subsets: ['latin'],
});
const pixel = Pixelify_Sans({ variable: '--font-pixel', subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'Code / Color / Curiosity',
  description:
    'Franyel Diaz Rodriguez builds websites, canvas experiments, and games.',
  metadataBase: new URL('https://franyel-studio.franyel1.chatgpt.site'),
  applicationName: 'Code / Color / Curiosity',
  authors: [{ name: 'Franyel Diaz Rodriguez' }],
  keywords: ['web development', 'creative coding', 'canvas', 'portfolio'],
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Code / Color / Curiosity',
    description:
      'Portfolio of Franyel Diaz Rodriguez: websites, canvas experiments, and games.',
    url: '/',
    siteName: 'Franyel Diaz Rodriguez',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code / Color / Curiosity',
    description:
      'Portfolio of Franyel Diaz Rodriguez: websites, canvas experiments, and games.',
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${body.variable} ${hand.variable} ${mono.variable} ${pixel.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
