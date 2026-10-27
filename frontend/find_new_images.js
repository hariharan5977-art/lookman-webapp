import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const dir = 'C:/Users/LOOKMAN/.gemini/antigravity-ide/brain/92beaac4-8337-4a48-898a-08cf196a78a7/.tempmediaStorage';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

files.sort((a, b) => {
  return fs.statSync(path.join(dir, b)).mtimeMs - fs.statSync(path.join(dir, a)).mtimeMs;
});

console.log('Top 15 newest files in .tempmediaStorage:');
files.slice(0, 15).forEach(f => {
  const stat = fs.statSync(path.join(dir, f));
  console.log(f, stat.size, new Date(stat.mtimeMs).toLocaleTimeString());
});
