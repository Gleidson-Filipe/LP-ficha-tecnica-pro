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
    <html lang="pt-BR" className="antialiased">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f%5B%5D=switzer@400,500,600,700,800&f%5B%5D=general-sans@400,500,600&display=swap"
        />
        {/* Manrope & Archivo — usadas no header e hero (fiel ao teste1) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@100..900&family=Manrope:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
