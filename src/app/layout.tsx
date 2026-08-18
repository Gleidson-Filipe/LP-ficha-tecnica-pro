import type { Metadata, Viewport } from "next";
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
