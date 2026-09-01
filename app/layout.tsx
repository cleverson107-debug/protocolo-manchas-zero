import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';

const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage-grotesque',
  subsets: ['latin'],
  preload: false,
});

export const metadata: Metadata = {
  title: 'Protocolo Manchas Zero',
  description: 'Um protocolo de cuidados para axilas e virilha mais uniformes em 21 dias.',
  metadataBase: new URL('https://manchaszero.upnexa.com.br'),
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
      <head>
        <link rel="preload" as="image" href="/hero-manchas-zero-mobile.webp" media="(max-width: 720px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/hero-manchas-zero.webp" media="(min-width: 721px)" fetchPriority="high" />
      </head>
      <body
        className={`${bricolageGrotesque.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
