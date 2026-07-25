import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, '../node_modules/highs/build/highs.wasm');
const destDir = path.resolve(__dirname, '../public');

mkdirSync(destDir, { recursive: true });
copyFileSync(src, path.join(destDir, 'highs.wasm'));
console.log('Copied highs.wasm -> public/highs.wasm');
