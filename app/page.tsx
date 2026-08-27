'use client';
import { useEffect, useState } from 'react';
import { LockKeyhole, ShieldCheck, Trophy } from 'lucide-react';

const modules=[
  {
    title:'A causa das manchas',
    description:'Descubra exatamente o que causa suas manchas e veja o que precisa mudar a partir de hoje.',
    image:'/modulo-causa-manchas.webp',
  },
  {
    title:'Sua rotina de 10 minutos',
    description:'Com 10 minutos diários, de forma simples, você aplica os cuidados e começa a se libertar da insegurança.',
    image:'/modulo-rotina-10-minutos.webp',
  },
  {
    title:'Mantenha os resultados',
    description:'Aprenda a manter a pele uniforme com os cuidados que impedem as manchas de voltarem.',
    image:'/modulo-mantenha-resultados-v2.webp',
  },
];
const feedbacks=[
  ['Depoimento 1','400×600'],
  ['Depoimento 2','400×600'],
  ['Depoimento 3','400×600'],
  ['Depoimento 4','400×600'],
  ['Depoimento 5','400×600'],
  ['Depoimento 6','400×600'],
];
const faqs=[
  ['Quanto tempo leva para ver resultados?','Muitas clientes relatam mudanças visíveis em até 21 dias, seguindo o protocolo diariamente.'],
  ['Esse método funciona para todos os tipos de pele?','Sim, o método asiático é adaptado para diferentes tipos de pele, mas, caso tenha sensibilidade, é importante seguir com cuidado.'],
  ['O acesso ao método é vitalício?','Sim, após a compra, você tem acesso vitalício ao conteúdo, podendo consultar sempre que quiser.'],
  ['Preciso de algum produto específico ou o método usa apenas cuidados caseiros?','O método prioriza cuidados caseiros, com dicas de ingredientes acessíveis, mas indica produtos complementares.'],
  ['Para quem o método é indicado?','O método foi pensado para mulheres de todas as idades que enfrentam insegurança causada pelas manchas, seja na axila, virilha ou em outras regiões. O foco é no autocuidado e na confiança, sem restrição de idade.'],
];

export default function Home(){
  const [openModule,setOpenModule]=useState<number|null>(0);
  const [openFaq,setOpenFaq]=useState<number|null>(0);
  const [upsell,setUpsell]=useState(false);
  useEffect(()=>{const f=(e:KeyboardEvent)=>e.key==='Escape'&&setUpsell(false);addEventListener('keydown',f);return()=>removeEventListener('keydown',f)},[]);
  return <main>
    <div className="topbar">VÁLIDO SÓ HOJE, 27 DE AGOSTO DE 2026</div>
    <section className="hero"><div className="container hero-grid">
      <HeroArt/>
      <div className="hero-copy"><p className="eyebrow">PROTOCOLO MANCHAS ZERO</p><h1>Sente <span className="soft-highlight">vergonha de mostrar seu corpo</span>, seja em público ou em momentos íntimos?</h1><p className="lead">O <span className="soft-highlight">Protocolo Manchas Zero</span> devolve a liberdade da sua pele, com axilas e virilha mais uniformes em <span className="soft-highlight">21 dias</span>.</p><a href="#oferta-simples" className="cta hero-cta">QUERO O PROTOCOLO <span>↗</span></a><Trust/></div>
    </div></section>

    <section className="section proof"><div className="container"><div className="proof-heading"><p>Elas se escondiam.</p><h2>Hoje mostram seus resultados.</h2></div></div><div className="marquee"><div className="marquee-track">{[...feedbacks,...feedbacks].map((f,i)=><article className="feedback" key={i}><p>{f[0]} {f[1]}</p></article>)}</div></div></section>

    <section className="section modules"><div className="container"><Heading eyebrow="MÓDULOS" title="Tudo o que você receberá assim que confirmar sua compra"/><div className="cover-scroll">{modules.map((module,i)=><article className="module-cover" key={module.title}><img className="module-image" src={module.image} alt={`Arte do módulo ${i+1}: ${module.title}`} width="1100" height="825" loading="lazy" decoding="async"/><small>Módulo {i+1}</small><strong>{module.title}</strong><p className="module-description">{module.description}</p></article>)}</div></div></section>

    <section className="section bonuses"><div className="container"><Heading eyebrow="BÔNUS" title="E você ainda recebe 3 bônus exclusivos"/><div className="bonus-list">{[
      ['Método Asiático Pele Saudável','Descubra hábitos simples e eficazes, inspirados em rotinas asiáticas, que você pode aplicar no seu dia a dia para manter sua pele uniforme e saudável por muito mais tempo.','R$ 29,90','/bonus-metodo-asiatico.webp'],
      ['Rotina Anti-Oleosidade Noturna','Equilibre a oleosidade da sua pele com uma rotina noturna específica, reduzindo o brilho e acelerando o clareamento das manchas.','R$ 19,90','/bonus-rotina-anti-oleosidade.webp'],
      ['Grupo Exclusivo no WhatsApp','Tenha acesso à nossa comunidade exclusiva no WhatsApp, com acompanhamento personalizado, dicas semanais e suporte contínuo na sua jornada.','R$ 14,90','/bonus-grupo-whatsapp.webp']
    ].map((b,i)=><article className="bonus" key={b[0]}><div className="bonus-number">Bônus 0{i+1}</div><div className={`bonus-art art-${i+1}`}><img src={b[3]} alt={`Arte do bônus ${i+1}: ${b[0]}`} width="1000" height="1000" loading="lazy" decoding="async" /></div><div className="bonus-copy"><small>Incluso na oferta completa</small><h3>{b[0]}</h3><p>{b[1]}</p><span className="old-price">Valor: {b[2]}</span></div></article>)}</div></div></section>

    <section id="precos" className="section pricing"><div className="container"><Heading eyebrow="OFERTAS" title="Escolha sua oferta"/><div className="price-grid">
      <article id="oferta-simples" className="price-card basic"><h3>Oferta Simples</h3><small>VOCÊ RECEBE:</small><ul><li>Protocolo Manchas Zero</li><li>Acesso Vitalício</li></ul><div className="from">De <s>R$ 37,90</s><br/>Hoje por apenas</div><div className="price-value"><span>4x de R$</span><strong>4,48</strong></div><div className="from">ou R$ 17,90 à vista no Pix</div><button onClick={()=>setUpsell(true)}>QUERO O PROTOCOLO</button><Trust compact/></article>
      <article className="price-card complete"><div className="popular">MAIS VENDIDO</div><h3>Oferta Completa</h3><small>VOCÊ RECEBE:</small><ul className="offer-main"><li>Protocolo Manchas Zero</li><li>Acesso Vitalício</li></ul><div className="included-bonuses"><small>BÔNUS INCLUSOS</small><ul><li>Método Asiático Pele Saudável</li><li>Rotina Anti-Oleosidade Noturna</li><li>Grupo Exclusivo no WhatsApp</li></ul></div><div className="from">De <s>R$ 67,90</s><br/>Hoje por apenas</div><div className="price-value"><span>6x de R$</span><strong>4,65</strong></div><div className="from">ou R$ 27,90 à vista no Pix</div><a id="comprar" href="#" className="buy-button">QUERO A OFERTA COMPLETA</a><Trust compact/></article>
    </div></div></section>

    <section className="section guarantee"><div className="container guarantee-inner"><div className="seal"><span>7</span><b>DIAS</b><small>GARANTIA</small></div><div><p className="eyebrow">RISCO ZERO</p><h2>7 Dias de garantia</h2><p>Se dentro do prazo de garantia você concluir que o produto não atendeu às suas expectativas, basta solicitar o reembolso. Devolveremos 100% do seu dinheiro, sem burocracia.</p></div></div></section>

    <section className="section faq"><div className="container faq-inner"><Heading eyebrow="FAQ" title="Perguntas frequentes"/>{faqs.map((f,i)=><Accordion key={f[0]} title={f[0]} open={openFaq===i} onClick={()=>setOpenFaq(openFaq===i?null:i)}>{f[1]}</Accordion>)}</div></section>
    <footer><div className="container"><p>© 2026 Protocolo Manchas Zero</p></div></footer>

    {upsell&&<div className="modal-bg" onMouseDown={()=>setUpsell(false)}><div className="modal upgrade-modal" role="dialog" aria-modal="true" aria-labelledby="upsell-title" onMouseDown={e=>e.stopPropagation()}><button className="close" onClick={()=>setUpsell(false)} aria-label="Fechar">×</button><div className="modal-tag">UPGRADE EXCLUSIVO</div><h2 id="upsell-title">Espera! Antes de levar apenas o protocolo...</h2><p>Você escolheu a Oferta Simples por <b>R$ 17,90</b>. Mas somente agora você pode adicionar os 3 bônus exclusivos e transformar sua compra na Oferta Completa pagando apenas <b>R$ 4 a mais</b>.</p><div className="upgrade-price"><span>+ R$ 4,00</span><small>Em vez de pagar R$ 27,90</small><strong>R$ 21,90</strong><em>ou 5x de R$ 4,38</em></div><p className="upgrade-now">Pague R$ 21,90 somente agora.</p><div className="upgrade-includes"><b>Você recebe:</b><ul><li>Protocolo Manchas Zero</li><li>Acesso vitalício</li><li>Método Asiático Pele Saudável</li><li>Rotina Anti-Oleosidade Noturna</li><li>Grupo Exclusivo no WhatsApp</li></ul></div><a href="#comprar" className="cta" onClick={()=>setUpsell(false)}>SIM, QUERO TUDO POR + R$ 4,00</a><p className="upgrade-note">Adicione todos os bônus à sua compra pagando apenas R$ 4 a mais.</p><button className="decline" onClick={()=>setUpsell(false)}>NÃO, QUERO APENAS O PROTOCOLO</button></div></div>}
  </main>
}

function Heading({eyebrow,title,subtitle}:{eyebrow:string,title:string,subtitle?:string}){return <div className="heading"><p>{eyebrow}</p><h2>{title}</h2>{subtitle&&<span>{subtitle}</span>}</div>}
function Trust({compact=false}:{compact?:boolean}){const size=compact?14:19;return <div className={`trust ${compact?'compact':''}`} aria-label="Selos de confiança"><span><ShieldCheck size={size} strokeWidth={1.5} aria-hidden="true"/><b>Compra<br/>Segura</b></span><span><Trophy size={size} strokeWidth={1.5} aria-hidden="true"/><b>Satisfação<br/>Garantida</b></span><span><LockKeyhole size={size} strokeWidth={1.5} aria-hidden="true"/><b>Privacidade<br/>Protegida</b></span></div>}
function Accordion({title,open,onClick,children}:{title:string,open:boolean,onClick:()=>void,children:React.ReactNode}){return <div className={`accordion ${open?'open':''}`}><button onClick={onClick} aria-expanded={open}><span>{title}</span><b>{open?'−':'+'}</b></button><div className="answer"><p>{children}</p></div></div>}
function HeroArt(){return <div className="hero-art"><img src="/hero-manchas-zero.webp" alt="Protocolo Manchas Zero apresentado em diferentes dispositivos e produtos de cuidados com a pele" width="1600" height="900" fetchPriority="high" decoding="async" /></div>}
