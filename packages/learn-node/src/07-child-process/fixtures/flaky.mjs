import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const [counterPath, succeedAt = '3'] = process.argv.slice(2);
const current = existsSync(counterPath)
  ? Number(readFileSync(counterPath, 'utf8')) || 0
  : 0;
const next = current + 1;
writeFileSync(counterPath, String(next));

if (next < Number(succeedAt)) {
  console.error(`attempt ${next} failed`);
  process.exit(1);
}

console.log(`attempt ${next} ok`);
