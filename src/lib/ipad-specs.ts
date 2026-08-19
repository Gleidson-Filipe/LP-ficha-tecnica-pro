/**
 * Números puros do modelo do iPad, sem nenhum import de three.js. Importar
 * essas medidas (ex.: pra calcular a proporção/border-radius do wrapper em
 * video-tablet.tsx) não pode arrastar o three.js pro bundle — só a cena 3D
 * em si (video-tablet-canvas.tsx) precisa da lib pesada.
 */
export interface IPadDimensions {
  bodyWidth: number;
  bodyHeight: number;
  bodyDepth: number;
  cornerRadius: number;
  silverRimWidth: number;
  screenWidth: number;
  screenHeight: number;
  screenCornerRadius: number;
  aspectRatio: number;
  screenAspect: number;
  bezelThickness: number;
  bezelLeft: number;
  bezelRight: number;
  bezelTop: number;
  bezelBottom: number;
}

export const IPAD_SPECS: IPadDimensions = {
  bodyWidth: 10.0,
  bodyHeight: 5.912438,
  bodyDepth: 0.22,
  cornerRadius: 0.394,
  silverRimWidth: 0.027,
  screenWidth: 9.343,
  screenHeight: 5.255438,
  screenCornerRadius: 0.110,
  aspectRatio: 10.0 / 5.912438, // 1.69135
  screenAspect: 16.0 / 9.0, // 1.777778 (16:9 Widescreen)
  bezelThickness: 0.3285,
  bezelLeft: 0.3285 / 10.0, // 0.03285 (3.285%)
  bezelRight: 0.3285 / 10.0, // 0.03285 (3.285%)
  bezelTop: 0.3285 / 5.912438, // 0.05556 (5.556%)
  bezelBottom: 0.3285 / 5.912438, // 0.05556 (5.556%)
};
