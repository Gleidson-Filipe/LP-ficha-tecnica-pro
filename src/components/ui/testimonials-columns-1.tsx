"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface TestimonialItem {
  text?: string;
  image?: string;
  name?: string;
  role?: string;
  src?: string;
  w?: number;
  h?: number;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const duration = props.duration || 20;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn("overflow-hidden select-none", props.className)}
    >
      <div
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
        className="flex flex-col gap-4 pb-4 animate-testimonials-scroll"
      >
        {[...new Array(2).fill(0)].map((_, loopIdx) => (
          <React.Fragment key={loopIdx}>
            {props.testimonials.map((item, i) => {
              if (item.src) {
                return (
                  <div
                    key={`${loopIdx}-${i}`}
                    className="relative w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.015] bg-white rule-box"
                  >
                    <Image
                      src={item.src}
                      alt={`Depoimento de cliente ${i + 1}`}
                      width={item.w || 1080}
                      height={item.h || 1080}
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 46vw, 92vw"
                      className="w-full h-auto object-contain rounded-2xl"
                    />
                  </div>
                );
              }

              return (
                <div
                  key={`${loopIdx}-${i}`}
                  className="p-6 rounded-2xl border border-black/10 shadow-sm max-w-[280px] w-full bg-paper hover:shadow-md transition-shadow"
                >
                  <div className="text-xs sm:text-sm leading-relaxed text-on-paper">{item.text}</div>
                  <div className="flex items-center gap-3 mt-4">
                    {item.image && (
                      <img
                        width={36}
                        height={36}
                        src={item.image}
                        alt={item.name || ""}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    )}
                    <div className="flex flex-col">
                      <div className="font-semibold text-xs text-on-paper leading-tight">{item.name}</div>
                      <div className="text-[11px] text-on-paper-soft leading-tight mt-0.5">{item.role}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
