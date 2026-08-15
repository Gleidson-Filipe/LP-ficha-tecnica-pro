"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Video } from "@/components/sections/video";

/**
 * Vídeo fica por baixo (sticky, centralizado no viewport, z-0) enquanto `children`
 * (a seção "Para quem é"/Problema) fica em `position: absolute` por cima
 * (z-10), cobrindo o vídeo conforme o scroll avança.
 */
export function VideoCover({ children }: { children: ReactNode }) {
  const videoRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const [coverHeight, setCoverHeight] = useState<number>();

  useEffect(() => {
    const coverEl = coverRef.current;
    if (!coverEl) return;

    const update = () => setCoverHeight(coverEl.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(coverEl);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      className="relative"
      style={{ height: coverHeight ? `calc(100vh + ${coverHeight}px)` : undefined }}
    >
      <div
        ref={videoRef}
        className="sticky top-0 z-0 flex h-screen w-full items-center justify-center"
      >
        <Video />
      </div>
      <div ref={coverRef} className="absolute inset-x-0 top-[100vh] z-10">
        {children}
      </div>
    </div>
  );
}
