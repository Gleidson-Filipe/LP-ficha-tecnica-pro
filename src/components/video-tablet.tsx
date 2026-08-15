"use client";

import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import {
  createIPadTabletModel,
  IPAD_SPECS,
} from "@/lib/generated/createIPadTabletMockupModel";

// Proporção exata do corpo do iPad Pro (10.0 / 5.912438 = 1.69135)
const CONTAINER_ASPECT = IPAD_SPECS.aspectRatio;

// Margem de enquadramento da câmera (2.0% para acomodar os botões em 3D)
const CAMERA_MARGIN = 0.020;
const SCALE_FACTOR = 1 / (1 + CAMERA_MARGIN);
const SIDE_MARGIN = (CAMERA_MARGIN / 2) * 100;

// Insets exatos da tela 16:9 sincronizados com o modelo 3D
export const TABLET_SCREEN_INSET = {
  top: `${(SIDE_MARGIN + IPAD_SPECS.bezelTop * 100 * SCALE_FACTOR).toFixed(3)}%`,
  bottom: `${(SIDE_MARGIN + IPAD_SPECS.bezelBottom * 100 * SCALE_FACTOR).toFixed(3)}%`,
  left: `${(SIDE_MARGIN + IPAD_SPECS.bezelLeft * 100 * SCALE_FACTOR).toFixed(3)}%`,
  right: `${(SIDE_MARGIN + IPAD_SPECS.bezelRight * 100 * SCALE_FACTOR).toFixed(3)}%`,
};

export function VideoTablet({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    // -------------------------------------------------------------
    // THREE.JS SCENE SETUP - CAMERA ENQUADRADA COM MARGEM DE BOTÕES
    // -------------------------------------------------------------
    const scene = new THREE.Scene();

    const fov = 24;
    const camera = new THREE.PerspectiveCamera(fov, CONTAINER_ASPECT, 0.1, 100);

    const fitHeight = IPAD_SPECS.bodyHeight * (1 + CAMERA_MARGIN);
    const distance = fitHeight / (2 * Math.tan((fov * Math.PI) / 360));
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.background = "transparent";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    // Adiciona o modelo fiel do iPad Pro
    const ipadModel = createIPadTabletModel();
    scene.add(ipadModel);

    // -------------------------------------------------------------
    // ILUMINAÇÃO DE ESTÚDIO FOTOGRÁFICO EQUILIBRADA
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe8f0ff, 0.85);
    rimLight.position.set(-6, 5, 4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(0, -6, 4);
    scene.add(fillLight);

    const render = () => {
      renderer.render(scene, camera);
    };
    render();

    // -------------------------------------------------------------
    // RESIZE OBSERVER PARA BORDER-RADIUS CIRCULAR CONCÊNTRICO EM PIXELS
    // -------------------------------------------------------------
    const ro = new ResizeObserver(() => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;

      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      render();

      // Raio do corpo do iPad em pixels (100% circular, idêntico à malha 3D)
      const bodyPxRadius = w * (IPAD_SPECS.cornerRadius / IPAD_SPECS.bodyWidth) * SCALE_FACTOR;
      if (shadowRef.current) {
        shadowRef.current.style.borderRadius = `${bodyPxRadius.toFixed(1)}px`;
      }

      // Raio da tela interna em pixels
      if (screenRef.current) {
        const screenPxRadius = w * (IPAD_SPECS.screenCornerRadius / IPAD_SPECS.bodyWidth) * SCALE_FACTOR;
        screenRef.current.style.borderRadius = `${screenPxRadius.toFixed(1)}px`;
      }
    });
    ro.observe(host);

    return () => {
      ro.disconnect();
      renderer.dispose();
      if (host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="isolate relative mx-auto w-full max-w-[1040px] select-none"
      style={{
        aspectRatio: CONTAINER_ASPECT,
      }}
    >
      {/* Sombra de estúdio fotográfico hiper-realista alinhada ao corpo 3D do iPad */}
      <div
        ref={shadowRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-0"
        style={{
          top: `${SIDE_MARGIN.toFixed(3)}%`,
          bottom: `${SIDE_MARGIN.toFixed(3)}%`,
          left: `${SIDE_MARGIN.toFixed(3)}%`,
          right: `${SIDE_MARGIN.toFixed(3)}%`,
          boxShadow:
            "-30px 45px 95px -12px rgba(0, 0, 0, 0.48), -16px 24px 48px -8px rgba(0, 0, 0, 0.32), -6px 10px 20px -4px rgba(0, 0, 0, 0.20)",
        }}
      />

      {/* Three.js Canvas Layer (iPad Chassis, Chanfro PBR, Botões e Câmera) */}
      <div
        ref={canvasHostRef}
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: "transparent" }}
      />

      {/* Screen Video Layer (Display 16:9 perfeitamente enquadrado dentro do bezel) */}
      <div
        ref={screenRef}
        className="absolute overflow-hidden z-[10] bg-black"
        style={{
          ...TABLET_SCREEN_INSET,
        }}
      >
        {children}
      </div>
    </div>
  );
}
