import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { VideoCover } from "@/components/video-cover";
import { Problema } from "@/components/sections/problema";
import { Solucao } from "@/components/sections/solucao";
import { Diferenciais } from "@/components/sections/diferenciais";
import { Modulos } from "@/components/sections/modulos";
import { Calculo } from "@/components/sections/calculo";
import { Depoimentos } from "@/components/sections/depoimentos";
import { Preco } from "@/components/sections/preco";
import { Faq } from "@/components/sections/faq";

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
