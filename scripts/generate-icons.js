import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createPng(width, height, getPixelRgba) {
  const lineLength = width * 4 + 1;
  const rawData = Buffer.alloc(lineLength * height);

  for (let y = 0; y < height; y++) {
    const lineOffset = y * lineLength;
    rawData[lineOffset] = 0; // Filter 0: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y, width, height);
      const pxOffset = lineOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const body = Buffer.concat([typeBuf, data]);
    const crcVal = crc32(body);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, body, crcBuf]);
  }

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  return Buffer.concat([
    header,
    makeChunk('IHDR', ihdrData),
    makeChunk('IDAT', deflated),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

// Distance to line segment
function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x1 - x2) ** 2 + (y1 - y2) ** 2;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

// Draw full launcher icon with rounded squircle badge and HR workflow graphic
function renderWorkflowHRIcon(x, y, w, h, isRound = false) {
  const nx = x / w;
  const ny = y / h;
  const cx = 0.5;
  const cy = 0.5;

  // Background clipping (circle for isRound, rounded rect for square)
  let inBounds = true;
  if (isRound) {
    const dist = Math.hypot(nx - cx, ny - cy);
    if (dist > 0.48) inBounds = false;
  } else {
    const rx = 0.22;
    const dx = Math.max(Math.abs(nx - cx) - (0.48 - rx), 0);
    const dy = Math.max(Math.abs(ny - cy) - (0.48 - rx), 0);
    if (Math.hypot(dx, dy) > rx) inBounds = false;
  }

  if (!inBounds) return [0, 0, 0, 0];

  // Deep Navy to Midnight Slate Gradient Background
  const bgGrad = (nx + ny) * 0.5;
  let r = Math.round(15 + bgGrad * 12);
  let g = Math.round(23 + bgGrad * 35);
  let b = Math.round(42 + bgGrad * 60);

  // Subtle circular inner glow
  const distCenter = Math.hypot(nx - cx, ny - cy);
  if (distCenter < 0.35) {
    const glow = (1 - distCenter / 0.35) * 0.25;
    r = Math.round(r + 30 * glow);
    g = Math.round(g + 80 * glow);
    b = Math.round(b + 140 * glow);
  }

  // Inner Badge (HR Shield/Card)
  const badgeDx = Math.max(Math.abs(nx - cx) - 0.22, 0);
  const badgeDy = Math.max(Math.abs(ny - cy) - 0.22, 0);
  const badgeDist = Math.hypot(badgeDx, badgeDy);
  if (badgeDist <= 0.08) {
    // Inside badge
    const badgeGrad = (nx * 0.7 + ny * 0.3);
    // Gradient from Royal Blue (#1E40AF) to Teal (#0F766E)
    r = Math.round(30 * (1 - badgeGrad) + 15 * badgeGrad);
    g = Math.round(64 * (1 - badgeGrad) + 118 * badgeGrad);
    b = Math.round(175 * (1 - badgeGrad) + 110 * badgeGrad);

    // Badge border stroke
    if (badgeDist >= 0.065 && badgeDist <= 0.08) {
      r = Math.min(255, r + 70);
      g = Math.min(255, g + 100);
      b = Math.min(255, b + 120);
    }
  }

  // HR Team Node (Head at center-top: cx=0.5, cy=0.36)
  const headDist = Math.hypot(nx - 0.5, ny - 0.36);
  if (headDist <= 0.042) {
    return [255, 255, 255, 255];
  }

  // Stylized "W" & HR workflow ribbon
  // Points: (0.35, 0.47) -> (0.41, 0.65) -> (0.47, 0.51) -> (0.50, 0.56) -> (0.53, 0.51) -> (0.59, 0.65) -> (0.65, 0.47)
  const pts = [
    [0.35, 0.47],
    [0.41, 0.65],
    [0.47, 0.51],
    [0.50, 0.56],
    [0.53, 0.51],
    [0.59, 0.65],
    [0.65, 0.47]
  ];

  let minRibbonDist = 999;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = distToSegment(nx, ny, pts[i][0], pts[i][1], pts[i+1][0], pts[i+1][1]);
    if (d < minRibbonDist) minRibbonDist = d;
  }

  if (minRibbonDist <= 0.024) {
    return [255, 255, 255, 255];
  }

  // Emerald Green Attendance Pulse Checkmark: (0.62, 0.38) -> (0.65, 0.42) -> (0.71, 0.34)
  const checkPts = [
    [0.62, 0.38],
    [0.65, 0.42],
    [0.71, 0.34]
  ];
  let minCheckDist = 999;
  for (let i = 0; i < checkPts.length - 1; i++) {
    const d = distToSegment(nx, ny, checkPts[i][0], checkPts[i][1], checkPts[i+1][0], checkPts[i+1][1]);
    if (d < minCheckDist) minCheckDist = d;
  }

  if (minCheckDist <= 0.02) {
    // Vibrant Emerald #34D399
    return [52, 211, 153, 255];
  }

  return [Math.min(255, r), Math.min(255, g), Math.min(255, b), 255];
}

// Generate all sizes
const sizes = [
  { path: 'public/icon-192.png', size: 192, round: false },
  { path: 'public/icon-512.png', size: 512, round: false },
  { path: 'android/app/src/main/res/mipmap-mdpi/ic_launcher.png', size: 48, round: false },
  { path: 'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png', size: 48, round: true },
  { path: 'android/app/src/main/res/mipmap-hdpi/ic_launcher.png', size: 72, round: false },
  { path: 'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png', size: 72, round: true },
  { path: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png', size: 96, round: false },
  { path: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png', size: 96, round: true },
  { path: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png', size: 144, round: false },
  { path: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png', size: 144, round: true },
  { path: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', size: 192, round: false },
  { path: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png', size: 192, round: true }
];

for (const item of sizes) {
  const buf = createPng(item.size, item.size, (x, y, w, h) => renderWorkflowHRIcon(x, y, w, h, item.round));
  const fullPath = path.resolve(process.cwd(), item.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, buf);
  console.log(`Generated ${item.path} (${item.size}x${item.size})`);
}
console.log('All icons generated successfully!');
