import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { VideoCover } from "@/components/video-cover";

/*
 * Abaixo da dobra em chunks separados (next/dynamic, mesma técnica já usada
 * pro three.js/lottie — ver memória do projeto): o Hero usa GSAP pra
 * animar a entrada (headline/CTA), e os efeitos de hidratação do React
 * disparam numa ÚNICA leva síncrona pra toda a árvore — sem separar em
 * chunks, o GSAP do Hero só rodava depois de TODAS essas ~8 seções
 * (cada uma com dezenas de WhipInUp/Reveal próprios) também hidratarem,
 * mesmo elas estando fora de tela. Medido sob CPU 4×: CTA preso em
 * opacity:0 por 3-4s+. Isso não troca nada de GSAP por CSS — só faz a
 * hidratação de cada seção rodar no seu próprio chunk, sem competir pela
 * mesma leva síncrona que bloqueia o Hero. HTML/SEO continuam intactos
 * (ssr:true é o padrão do next/dynamic).
 */
const Problema = dynamic(() =>
  import("@/components/sections/problema").then((m) => m.Problema),
);
const Solucao = dynamic(() =>
  import("@/components/sections/solucao").then((m) => m.Solucao),
);
const Diferenciais = dynamic(() =>
  import("@/components/sections/diferenciais").then((m) => m.Diferenciais),
);
const Modulos = dynamic(() =>
  import("@/components/sections/modulos").then((m) => m.Modulos),
);
const Calculo = dynamic(() =>
  import("@/components/sections/calculo").then((m) => m.Calculo),
);
const Depoimentos = dynamic(() =>
  import("@/components/sections/depoimentos").then((m) => m.Depoimentos),
);
const Preco = dynamic(() =>
  import("@/components/sections/preco").then((m) => m.Preco),
);
const Faq = dynamic(() => import("@/components/sections/faq").then((m) => m.Faq));

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Promessa */}
        <Hero />
        <VideoCover>
          {/* Para quem é, o problema e a planilha como solução */}
          <Problema />
        </VideoCover>
        {/* A virada */}
        <Solucao />
        <Modulos />
        {/* A prova técnica */}
        <Calculo />
        <Diferenciais />
        {/* Decisão */}
        <Depoimentos />
        <Preco />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
