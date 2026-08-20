"use client";

import { useEffect, type RefObject } from "react";
import * as THREE from "three";
import { createIPadTabletModel, IPAD_SPECS } from "@/lib/generated/createIPadTabletMockupModel";

const CONTAINER_ASPECT = IPAD_SPECS.aspectRatio;
const CAMERA_MARGIN = 0.020;

/**
 * Só a cena three.js (câmera, luzes, modelo do iPad, render loop). Carregado
 * via next/dynamic({ ssr: false }) a partir de video-tablet.tsx, e só
 * montado quando o tablet está perto da viewport — ver o IntersectionObserver
 * lá. Nunca decide a altura de nada (isso é responsabilidade do shell, via
 * aspectRatio do wrapper), então não há salto de layout quando entra.
 */
export function VideoTabletCanvas({
  host,
}: {
  host: RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    const el = host.current;
    if (!el) return;

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
      // O modelo é estático (nada anima aqui) — sem isso, o WebGL limpa o
      // drawing buffer depois do primeiro frame por não haver um loop de
      // render contínuo, e o iPad "pisca" uma vez e some (só o chassi CSS
      // de fundo fica visível). Preservar o buffer evita ter que rodar um
      // requestAnimationFrame a cada frame só pra manter algo que nunca muda.
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.background = "transparent";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    // Sem position, o canvas nasce "static" — e por regra de empilhamento
    // do CSS, um irmão position:absolute (o chassi CSS de fallback) pinta
    // por cima de conteúdo em fluxo normal mesmo vindo antes no DOM, então
    // o fallback cobria o WebGL mesmo com o buffer renderizado certo por
    // trás. Posicionar o canvas também tira ele desse fluxo e restaura a
    // ordem por tree order entre os dois (o canvas, que vem depois, pinta
    // por cima).
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    el.appendChild(renderer.domElement);

    const ipadModel = createIPadTabletModel();
    scene.add(ipadModel);

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

    const ro = new ResizeObserver(() => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      render();
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [host]);

  return null;
}
