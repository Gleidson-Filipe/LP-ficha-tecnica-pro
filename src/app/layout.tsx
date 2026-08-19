import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ScrollRestore } from "@/components/scroll-restore";
import { LenisProvider } from "@/components/lenis-provider";
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
          Salta pra posição de scroll salva (sessionStorage, gravada pelo
          ScrollRestore no pagehide) ANTES da primeira pintura — bloqueante
          de propósito, senão o navegador pinta o topo primeiro e só depois
          pula, dando um "flash" do header antes de chegar na seção certa.
          O resto (ScrollTrigger.refresh() etc.) fica no componente
          ScrollRestore, que não precisa ser bloqueante.
        */}
        <Script id="scroll-jump" strategy="beforeInteractive">
          {`
            (function () {
              if (!('scrollRestoration' in history)) return;
              history.scrollRestoration = 'manual';
              if (location.hash) return;
              var saved = sessionStorage.getItem('ftp:scrollY:' + location.pathname);
              var y = saved === null ? NaN : parseInt(saved, 10);
              if (isFinite(y)) window.scrollTo(0, y);
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
      <body suppressHydrationWarning>
        <LenisProvider />
        <ScrollRestore />
        {children}
      </body>
    </html>
  );
}
