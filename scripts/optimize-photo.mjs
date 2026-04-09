import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

await sharp(resolve(ROOT, 'Aaqib.png'))
    .webp({ quality: 82, effort: 6 })
    .toFile(resolve(ROOT, 'public/aaqib.webp'));

console.log('aaqib.webp written to public/');
