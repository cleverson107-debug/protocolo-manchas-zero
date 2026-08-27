import type { Metadata } from 'next';
import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage-grotesque',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Protocolo Manchas Zero',
  description: 'Um protocolo de cuidados para axilas e virilha mais uniformes em 21 dias.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Protocolo Manchas Zero',
    description: 'Mais liberdade e confiança para mostrar sua pele.',
    images: ['/hero-manchas-zero.webp'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protocolo Manchas Zero',
    description: 'Mais liberdade e confiança para mostrar sua pele.',
    images: ['/hero-manchas-zero.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolageGrotesque.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
