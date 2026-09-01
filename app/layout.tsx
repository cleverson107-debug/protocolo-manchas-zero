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
        <script dangerouslySetInnerHTML={{__html:`(()=>{if('scrollRestoration'in history)history.scrollRestoration='manual';if(location.hash)history.replaceState(null,'',location.pathname+location.search);scrollTo(0,0);addEventListener('DOMContentLoaded',()=>scrollTo(0,0),{once:true})})()`}} />
        <script dangerouslySetInnerHTML={{__html:`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','813194448363424');fbq('track','PageView');`}} />
        <link rel="preload" as="image" href="/hero-manchas-zero-mobile.webp" media="(max-width: 720px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/hero-manchas-zero.webp" media="(min-width: 721px)" fetchPriority="high" />
      </head>
      <body
        className={`${bricolageGrotesque.variable} antialiased`}
      >
        <noscript><img height="1" width="1" style={{display:'none'}} src="https://www.facebook.com/tr?id=813194448363424&ev=PageView&noscript=1" alt="" /></noscript>
        {children}
      </body>
    </html>
  );
}
