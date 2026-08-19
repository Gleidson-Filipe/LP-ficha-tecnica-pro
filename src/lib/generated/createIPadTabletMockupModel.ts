import * as THREE from "three";
import { IPAD_SPECS, type IPadDimensions } from "@/lib/ipad-specs";

export type { IPadDimensions };
export { IPAD_SPECS };

function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;

  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(x + w, y + h - r);
  shape.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  shape.lineTo(x + r, y + h);
  shape.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + r);
  shape.absarc(x + r, y + r, r, Math.PI, (3 * Math.PI) / 2, false);
  shape.closePath();

  return shape;
}

/**
 * Cria textura de botão com o sombreamento nítido e curvatura evidente nas pontas (Pill Caps)
 */
function createSynchronousButtonTexture(isVertical: boolean): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const w = isVertical ? 24 : 256;
  const h = isVertical ? 256 : 24;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // 1. Contorno escuro da silhueta (#18191f)
    ctx.fillStyle = "#18191f";
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 6);
    ctx.fill();

    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    // Pintar o interior com degradê metálico e curvatura evidente nas extremidades
    if (!isVertical) {
      // Botões superiores (Volume)
      const capLen = 46.0; // 18% em cada ponta para curvatura e sombreamento nítidos
      for (let y = 1; y < h - 1; y++) {
        const fy = (y - 1) / (h - 3);
        let val = 255;
        if (fy < 0.22) {
          val = 255 - 35 * (fy / 0.22);
        } else if (fy < 0.65) {
          val = 220 - 45 * ((fy - 0.22) / 0.43);
        } else if (fy < 0.85) {
          val = 175 - 60 * ((fy - 0.65) / 0.20);
        } else {
          val = 115 - 75 * ((fy - 0.85) / 0.15);
        }

        for (let x = 1; x < w - 1; x++) {
          let capFactor = 1.0;
          if (x < capLen) {
            const t = (x - 1) / (capLen - 1);
            capFactor = 0.22 + 0.78 * Math.pow(t, 0.55);
          } else if (x > w - 1 - capLen) {
            const t = (w - 1 - x) / (capLen - 1);
            capFactor = 0.22 + 0.78 * Math.pow(t, 0.55);
          }

          const c = Math.round(val * capFactor);
          const idx = (y * w + x) * 4;
          data[idx] = c;
          data[idx + 1] = Math.min(255, Math.round(c * 1.01));
          data[idx + 2] = Math.min(255, Math.round(c * 1.06));
          data[idx + 3] = 255;
        }
      }
    } else {
      // Botão lateral (Power)
      const capLen = 32.0;
      for (let x = 1; x < w - 1; x++) {
        const fx = (x - 1) / (w - 3);
        let val = 255;
        if (fx < 0.22) {
          val = 255 - 35 * (fx / 0.22);
        } else if (fx < 0.65) {
          val = 220 - 45 * ((fx - 0.22) / 0.43);
        } else if (fx < 0.85) {
          val = 175 - 60 * ((fx - 0.65) / 0.20);
        } else {
          val = 115 - 75 * ((fx - 0.85) / 0.15);
        }

        for (let y = 1; y < h - 1; y++) {
          let capFactor = 1.0;
          if (y < capLen) {
            const t = (y - 1) / (capLen - 1);
            capFactor = 0.22 + 0.78 * Math.pow(t, 0.55);
          } else if (y > h - 1 - capLen) {
            const t = (h - 1 - y) / (capLen - 1);
            capFactor = 0.22 + 0.78 * Math.pow(t, 0.55);
          }

          const c = Math.round(val * capFactor);
          const idx = (y * w + x) * 4;
          data[idx] = c;
          data[idx + 1] = Math.min(255, Math.round(c * 1.01));
          data[idx + 2] = Math.min(255, Math.round(c * 1.06));
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

export function createIPadTabletModel(): THREE.Group {
  const ipad = new THREE.Group();
  ipad.name = "iPad_Pro_Mockup";

  const {
    bodyWidth: W,
    bodyHeight: H,
    bodyDepth: D,
    cornerRadius: R,
    silverRimWidth: RIM,
    screenWidth: SW,
  } = IPAD_SPECS;

  // -------------------------------------------------------------
  // MATERIAIS CONFORME A REFERÊNCIA MASTER
  // -------------------------------------------------------------

  // Sublinhado preto de contorno da silhueta (#18191f)
  const darkOutlineMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#18191f"),
  });

  // Alumínio prateado do chassi (#b0b4c2)
  const silverChassisMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#b0b4c2"),
  });

  // Chanfro prateado frontal (#b8bcc8)
  const silverChamferMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#b8bcc8"),
  });

  // Chanfro interno de sombra (#727684)
  const chamferShadowMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#727684"),
  });

  // Borda Frontal PRETA ABSOLUTA (Deep Obsidian Black Glass #0c0c0e)
  const blackBezelMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#0c0c0e"),
  });

  // Texturas síncronas dos botões com pontas arredondadas sombreadas com contraste
  const topBtnTex = createSynchronousButtonTexture(false);
  const leftBtnTex = createSynchronousButtonTexture(true);

  const topBtnMat = new THREE.MeshBasicMaterial({
    map: topBtnTex,
  });

  const leftBtnMat = new THREE.MeshBasicMaterial({
    map: leftBtnTex,
  });

  // Sensores Ópticos TrueDepth no Bezel Esquerdo
  const darkSensorMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#18181f"),
  });

  const micMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#050507"),
  });

  const camRingMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#1e1e26"),
  });

  const camLensMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#0d2e66"),
  });

  const camSpecularMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#367ced"),
  });

  // -------------------------------------------------------------
  // 1. SUBLINHADO PRETO DE CONTORNO DO CORPO (#18191f)
  // -------------------------------------------------------------
  const outlineShape = createRoundedRectShape(W + 0.010, H + 0.010, R + 0.005);
  const outlineGeo = new THREE.ShapeGeometry(outlineShape, 32);
  const outlineMesh = new THREE.Mesh(outlineGeo, darkOutlineMaterial);
  outlineMesh.position.set(0, 0, -D - 0.005);
  outlineMesh.name = "Dark_Silhouette_Outline";
  ipad.add(outlineMesh);

  // -------------------------------------------------------------
  // 2. CHASSIS UNIBODY EM ALUMÍNIO PRATEADO (#b0b4c2)
  // -------------------------------------------------------------
  const chassisShape = createRoundedRectShape(W, H, R);
  const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, {
    depth: D,
    bevelEnabled: false,
    curveSegments: 32,
  });
  const chassisMesh = new THREE.Mesh(chassisGeo, silverChassisMaterial);
  chassisMesh.name = "Silver_Unibody_Chassis";
  chassisMesh.position.set(0, 0, -D);
  ipad.add(chassisMesh);

  // -------------------------------------------------------------
  // 3. FIO / CHANFRO PRATEADO FRONTAL (13px / #b8bcc8)
  // -------------------------------------------------------------
  const frontSilverGeo = new THREE.ShapeGeometry(chassisShape, 32);
  const frontSilverMesh = new THREE.Mesh(frontSilverGeo, silverChamferMaterial);
  frontSilverMesh.position.set(0, 0, 0.005);
  frontSilverMesh.name = "Front_Silver_Rim_Plate";
  ipad.add(frontSilverMesh);

  // -------------------------------------------------------------
  // 4. CHANFRO INTERNO DE TRANSIÇÃO COM SOMBRA (#727684)
  // -------------------------------------------------------------
  const shadowW = W - RIM * 0.7;
  const shadowH = H - RIM * 0.7;
  const shadowR = Math.max(0.05, R - RIM * 0.7);
  const shadowShape = createRoundedRectShape(shadowW, shadowH, shadowR);
  const shadowGeo = new THREE.ShapeGeometry(shadowShape, 32);
  const chamferShadowMesh = new THREE.Mesh(shadowGeo, chamferShadowMaterial);
  chamferShadowMesh.position.set(0, 0, 0.012);
  chamferShadowMesh.name = "Chamfer_Inner_Shadow";
  ipad.add(chamferShadowMesh);

  // -------------------------------------------------------------
  // 5. MOLDURA FRONTAL PRETA COM ESPESSURA UNIFORME (#0c0c0e)
  // Posicionada em Z = 0.020
  // -------------------------------------------------------------
  const bezelW = W - RIM * 2;
  const bezelH = H - RIM * 2;
  const bezelR = Math.max(0.05, R - RIM);

  const bezelShape = createRoundedRectShape(bezelW, bezelH, bezelR);
  const bezelGeo = new THREE.ShapeGeometry(bezelShape, 32);
  const frontBlackBezelMesh = new THREE.Mesh(bezelGeo, blackBezelMaterial);
  frontBlackBezelMesh.position.set(0, 0, 0.020);
  frontBlackBezelMesh.name = "Deep_Black_Front_Bezel";
  ipad.add(frontBlackBezelMesh);

  // -------------------------------------------------------------
  // 6. MÓDULO TRUEDEPTH: OS 5 ELEMENTOS ÓPTICOS NA BORDA ESQUERDA
  // Posicionados em Z = 0.025
  // -------------------------------------------------------------
  const cameraGroup = new THREE.Group();
  cameraGroup.name = "TrueDepth_Camera_Module";

  const camX = -SW / 2 - (bezelW - SW) / 4;
  const camZ = 0.025;

  // Elemento 1 (Topo): Flood Illuminator
  const dot1Geo = new THREE.CircleGeometry(0.061, 32);
  const dot1 = new THREE.Mesh(dot1Geo, darkSensorMat);
  dot1.position.set(camX, 0.4768, camZ);
  cameraGroup.add(dot1);

  // Elemento 2: Microfone frontal (Pinhole)
  const dot2Geo = new THREE.CircleGeometry(0.0155, 16);
  const dot2 = new THREE.Mesh(dot2Geo, micMat);
  dot2.position.set(camX, 0.2384, camZ);
  cameraGroup.add(dot2);

  // Elemento 3: Lente principal da câmera frontal
  const camRingGeo = new THREE.RingGeometry(0.038, 0.052, 32);
  const camRing = new THREE.Mesh(camRingGeo, camRingMat);
  camRing.position.set(camX, -0.0062, camZ);
  cameraGroup.add(camRing);

  const camLensGeo = new THREE.CircleGeometry(0.038, 32);
  const camLens = new THREE.Mesh(camLensGeo, camLensMat);
  camLens.position.set(camX, -0.0062, camZ + 0.0005);
  cameraGroup.add(camLens);

  const camGlowGeo = new THREE.CircleGeometry(0.014, 16);
  const camGlow = new THREE.Mesh(camGlowGeo, camSpecularMat);
  camGlow.position.set(camX - 0.006, -0.0062 + 0.006, camZ + 0.001);
  cameraGroup.add(camGlow);

  // Elemento 4: Dot Projector
  const dot4Geo = new THREE.CircleGeometry(0.0674, 32);
  const dot4 = new THREE.Mesh(dot4Geo, darkSensorMat);
  dot4.position.set(camX, -0.2446, camZ);
  cameraGroup.add(dot4);

  // Elemento 5: Câmera Infravermelha
  const dot5Geo = new THREE.CircleGeometry(0.0518, 32);
  const dot5 = new THREE.Mesh(dot5Geo, darkSensorMat);
  dot5.position.set(camX, -0.483, camZ);
  cameraGroup.add(dot5);

  ipad.add(cameraGroup);

  // -------------------------------------------------------------
  // 7. BOTÕES METÁLICOS FÍSICOS (LOCALIZAÇÃO EXATA)
  // -------------------------------------------------------------
  const buttonsGroup = new THREE.Group();
  buttonsGroup.name = "Physical_Buttons";

  // A) Botão Lateral Esquerdo (Power / Lock)
  const powerY = H / 2 - 0.765;
  const leftBtnGeo = new THREE.PlaneGeometry(0.022, 0.816);
  const leftBtn = new THREE.Mesh(leftBtnGeo, leftBtnMat);
  leftBtn.position.set(-W / 2 - 0.011, powerY, 0.010);
  buttonsGroup.add(leftBtn);

  // B) Botões de Volume Superiores
  // Botão 1: Volume Up (x = -4.109, width = 0.356, height = 0.022)
  const volUpGeo = new THREE.PlaneGeometry(0.356, 0.022);
  const volUp = new THREE.Mesh(volUpGeo, topBtnMat);
  volUp.position.set(-4.109, H / 2 + 0.011, 0.010);
  buttonsGroup.add(volUp);

  // Botão 2: Volume Down (x = -3.678, width = 0.356, height = 0.022)
  const volDownGeo = new THREE.PlaneGeometry(0.356, 0.022);
  const volDown = new THREE.Mesh(volDownGeo, topBtnMat);
  volDown.position.set(-3.678, H / 2 + 0.011, 0.010);
  buttonsGroup.add(volDown);

  ipad.add(buttonsGroup);

  return ipad;
}
