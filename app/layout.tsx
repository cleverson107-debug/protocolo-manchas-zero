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
        <script dangerouslySetInnerHTML={{__html:`(()=>{if('scrollRestoration'in history)history.scrollRestoration='manual';if(location.hash)history.replaceState(null,'',location.pathname+location.search);scrollTo(0,0);addEventListener('DOMContentLoaded',()=>scrollTo(0,0),{once:true})})()`}} />
        <script dangerouslySetInnerHTML={{__html:`(()=>{if(window.fbq)return;const q=function(){q.callMethod?q.callMethod.apply(q,arguments):q.queue.push(arguments)};window.fbq=q;window._fbq=q;q.push=q;q.loaded=!0;q.version='2.0';q.queue=[];q('init','813194448363424');const load=()=>{const meta=document.createElement('script');meta.async=true;meta.fetchPriority='low';meta.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(meta);const track=document.createElement('script');track.async=true;track.fetchPriority='low';track.src='https://app.upnexa.com.br/api/public/tracker.js';track.dataset.site='tf_Bzm6TqPn820c1sG_';track.dataset.endpoint='/api/trackflow';document.head.appendChild(track)};addEventListener('load',()=>setTimeout(load,0),{once:true})})()`}} />
        <script defer src="/offer-tracking.js" />
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
