const escapeSvgText = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

const TONES = ["#1c1c21", "#202027", "#17171b", "#232329", "#1a1a1f"];

export function carImage(car, brandKey = "brand", variant = 0) {
  if (car.image) return car.image;

  const seed =
    Number(car.id) ||
    [...String(car.model || "")].reduce((total, character) => total + character.charCodeAt(0), 0);
  const background = TONES[(seed + variant) % TONES.length];
  const brand = escapeSvgText(car[brandKey] || "");
  const model = escapeSvgText(car.model || "");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300" direction="rtl">
  <rect width="480" height="300" fill="${background}"/>
  <rect y="238" width="480" height="62" fill="#0b0b0d"/>
  <g fill="#34343c">
    <path d="M60 205 L82 168 Q94 146 128 141 L196 136 Q226 108 274 108 L350 112 Q392 118 412 154 L438 164 Q456 170 456 205 Z"/>
    <circle cx="132" cy="206" r="30" fill="#0b0b0d" stroke="#34343c" stroke-width="6"/>
    <circle cx="384" cy="206" r="30" fill="#0b0b0d" stroke="#34343c" stroke-width="6"/>
  </g>
  <path d="M206 140 Q230 118 272 118 L346 122 Q372 128 388 150 Z" fill="#101013"/>
  <rect x="444" y="176" width="14" height="8" rx="3" fill="#e5212f"/>
  <text x="240" y="62" text-anchor="middle" font-family="Tahoma, Arial, sans-serif" font-size="30" font-weight="700" fill="#f5f5f6">${brand}</text>
  <text x="240" y="92" text-anchor="middle" font-family="Tahoma, Arial, sans-serif" font-size="20" fill="#9a9aa3">${model}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}
