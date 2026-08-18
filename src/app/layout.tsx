import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fichatecnicapro.com.br"),
  title: "Ficha Técnica Pro — Engenharia do lucro para gastronomia",
  description:
    "Planilha de gestão de custos e precificação para restaurantes, hamburguerias, pizzarias, confeitarias e delivery. Descubra o custo real e o lucro de cada item do cardápio.",
  openGraph: {
    title: "Ficha Técnica Pro — Engenharia do lucro para gastronomia",
    description:
      "Tenha preços que geram lucro, não apenas faturamento. Custo real por produto, CMV, margem e markup calculados automaticamente.",
    type: "website",
    locale: "pt_BR",
    siteName: "Ficha Técnica Pro",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#09090a" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="antialiased" suppressHydrationWarning>
      <head>
        {/*
          O Chrome restaura sozinho o scroll de onde você recarregou ANTES da
          página terminar de assentar o layout — se a altura de algo acima
          ainda estiver mudando nesse instante (numa máquina/CPU mais lenta
          essa janela fica bem maior), o scroll restaurado aponta pro lugar
          errado por um instante e você vê o conteúdo de outra seção.
          Assumindo o controle manual: guardamos a posição no pagehide e só
          restauramos no 'load' (depois de dois rAF, pra garantir que o
          layout final já foi pintado) — mantém "voltar de onde parou" sem a
          corrida. Se a URL tiver âncora (#secao), ela sempre vence.

          Depois de restaurar, disparamos um 'resize': é o evento que o GSAP
          ScrollTrigger escuta pra recalcular start/end e sincronizar o
          progresso do scrub com a posição atual — sem isso, um SALTO de
          scroll (em vez de rolagem gradual) deixa animações scrub (ex.: o
          título/tablet da seção de vídeo) travadas no estado em que
          nasceram, porque o ScrollTrigger nunca viu o scroll "passar" pelo
          intervalo de início/fim dele.
        */}
        <Script id="scroll-restoration-manual" strategy="beforeInteractive">
          {`
            (function () {
              if (!('scrollRestoration' in history)) return;
              history.scrollRestoration = 'manual';
              var KEY = 'ftp:scrollY:' + location.pathname;
              window.addEventListener('load', function () {
                if (location.hash) return;
                var saved = sessionStorage.getItem(KEY);
                if (saved === null) return;
                var y = parseInt(saved, 10);
                if (!isFinite(y)) return;
                requestAnimationFrame(function () {
                  requestAnimationFrame(function () {
                    window.scrollTo(0, y);
                    window.dispatchEvent(new Event('resize'));
                  });
                });
              });
              window.addEventListener('pagehide', function () {
                sessionStorage.setItem(KEY, String(window.scrollY));
              });
            })();
          `}
        </Script>
        <link
          rel="preload"
          href="/fonts/switzer-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/generalsans-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
