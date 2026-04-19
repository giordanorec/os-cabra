// Renderiza public/favicon.svg em múltiplos tamanhos PNG + ICO.
// Rodar: node scripts/art/generate-favicon.mjs
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import sharp from 'sharp'
import toIco from 'to-ico'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..', '..')
const srcSvg = resolve(root, 'public', 'favicon.svg')
const outDir = resolve(root, 'public')

const svg = await readFile(srcSvg)

const renderPng = (size) =>
  sharp(svg, { density: Math.max(96, size * 4) })
    .resize(size, size, { kernel: 'nearest', fit: 'contain' })
    .png({ compressionLevel: 9 })
    .toBuffer()

const sizes = [16, 32, 48, 192, 512]
const buffers = {}
for (const s of sizes) {
  buffers[s] = await renderPng(s)
  console.log(`rendered ${s}x${s}`)
}

await writeFile(resolve(outDir, 'favicon-192.png'), buffers[192])
await writeFile(resolve(outDir, 'favicon-512.png'), buffers[512])

const ico = await toIco([buffers[16], buffers[32], buffers[48]])
await writeFile(resolve(outDir, 'favicon.ico'), ico)

console.log('wrote favicon.ico (16/32/48), favicon-192.png, favicon-512.png')
