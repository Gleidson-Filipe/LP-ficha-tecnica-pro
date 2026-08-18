import type { ReactNode } from "react";
import { Video } from "@/components/sections/video";

/**
 * Vídeo fica por baixo (sticky, centralizado no viewport, z-0) enquanto `children`
 * (a seção "Para quem é"/Problema) fica em fluxo natural (z-10),
 * cobrindo o vídeo conforme o scroll avança.
 */
export function VideoCover({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="sticky top-0 z-0 flex h-screen w-full items-center justify-center">
        <Video />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
