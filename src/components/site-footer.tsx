import Image from "next/image";
import { rodape, INSTAGRAM, NAV, SLOGAN, CTA } from "@/lib/content";
import { Buy } from "@/components/ui/kit";

export function SiteFooter() {
  return (
    <footer className="t-ink rule-t">
      <div className="pad grid items-center gap-10 py-16 md:grid-cols-[1fr_auto] md:py-20">
        <p className="max-w-[14ch] font-display text-h2 text-balance">
          {rodape.chamada}
        </p>
        <Buy l1={CTA.rodape.l1} l2={CTA.rodape.l2} className="md:justify-self-end" />
      </div>

      <div className="cols rule-t md:grid-cols-3">
        <div>
          <Image
            src="/images/logo-ftp.png"
            alt="Ficha Técnica Pro"
            width={944}
            height={100}
            className="block h-auto w-[168px]"
          />
          <p className="mt-5 max-w-[30ch] text-body soft">{SLOGAN}.</p>
        </div>

        <nav aria-label="Seções do site">
          <p className="text-label uppercase soft">Navegar</p>
          <ul className="mt-5 space-y-3">
            {NAV.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className="text-body transition-colors hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-label uppercase soft">Realização</p>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex flex-col gap-3"
            aria-label={`${rodape.empresa} no Instagram`}
          >
            <Image
              src="/images/logo-gfd.png"
              alt={rodape.empresa}
              width={3036}
              height={1718}
              className="block h-auto w-[92px] opacity-80 transition-opacity group-hover:opacity-100"
            />
            <span className="text-body transition-colors group-hover:text-accent">
              @gestaofinanceiradigital ↗
            </span>
          </a>
        </div>
      </div>

      <p className="pad rule-t py-6 text-[0.875rem] soft">{rodape.copyright}</p>
    </footer>
  );
}
