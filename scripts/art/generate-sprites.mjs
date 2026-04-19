// Renderiza scripts/art/svg/*.svg em public/assets/sprites/ com atlas JSON
// compatível com Phaser. Rodar: node scripts/art/generate-sprites.mjs
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..', '..')
const svgDir = resolve(here, 'svg')
const outDir = resolve(root, 'public', 'assets', 'sprites')

// Manifesto: cada item vira um <key>.png (strip) + <key>.json (atlas)
const SPRITES = [
  { key: 'player',             frameW: 32,  frameH: 32,  frames: 3, svg: 'player.svg' },
  { key: 'enemy-passista',     frameW: 32,  frameH: 32,  frames: 2, svg: 'enemy-passista.svg' },
  { key: 'enemy-caboclinho',   frameW: 28,  frameH: 28,  frames: 2, svg: 'enemy-caboclinho.svg' },
  { key: 'enemy-mosca',        frameW: 14,  frameH: 14,  frames: 2, svg: 'enemy-mosca.svg' },
  { key: 'boss-maracatu',      frameW: 256, frameH: 256, frames: 1, svg: 'boss-maracatu.svg' }
]

async function renderOne(spec) {
  const svgPath = resolve(svgDir, spec.svg)
  const svg = await readFile(svgPath)
  const fullW = spec.frameW * spec.frames
  const fullH = spec.frameH

  // density alto pra textura crisp em downsample
  const pngBuf = await sharp(svg, { density: 512 })
    .resize(fullW, fullH, { kernel: 'lanczos3', fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer()

  await writeFile(resolve(outDir, `${spec.key}.png`), pngBuf)

  // Phaser JSON Hash atlas
  const frames = {}
  for (let i = 0; i < spec.frames; i++) {
    frames[`${spec.key}-${i}`] = {
      frame:          { x: i * spec.frameW, y: 0, w: spec.frameW, h: spec.frameH },
      rotated:        false,
      trimmed:        false,
      spriteSourceSize: { x: 0, y: 0, w: spec.frameW, h: spec.frameH },
      sourceSize:     { w: spec.frameW, h: spec.frameH }
    }
  }
  const atlas = {
    frames,
    meta: {
      app: 'os-cabra/generate-sprites.mjs',
      version: '1.0',
      image: `${spec.key}.png`,
      format: 'RGBA8888',
      size: { w: fullW, h: fullH },
      scale: '1'
    }
  }
  await writeFile(resolve(outDir, `${spec.key}.json`), JSON.stringify(atlas, null, 2))
  console.log(`wrote ${spec.key}: ${fullW}×${fullH}, ${spec.frames} frame(s)`)
}

for (const spec of SPRITES) {
  await renderOne(spec)
}

// Também gera versões @2x para HiDPI futuro
const hidpiDir = resolve(outDir, '@2x')
await (async () => {
  const { mkdir } = await import('node:fs/promises')
  await mkdir(hidpiDir, { recursive: true })
})()
for (const spec of SPRITES) {
  const svgPath = resolve(svgDir, spec.svg)
  const svg = await readFile(svgPath)
  const fullW = spec.frameW * spec.frames * 2
  const fullH = spec.frameH * 2
  const pngBuf = await sharp(svg, { density: 1024 })
    .resize(fullW, fullH, { kernel: 'lanczos3', fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer()
  await writeFile(resolve(hidpiDir, `${spec.key}.png`), pngBuf)
  console.log(`wrote @2x/${spec.key}.png: ${fullW}×${fullH}`)
}

console.log('done.')
