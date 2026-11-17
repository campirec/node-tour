import { brotliCompress, gzip } from 'node:zlib';
import { promisify } from 'node:util';

export type ContentEncoding = 'gzip' | 'br' | 'identity';

export interface CompressedPayload {
  encoding: ContentEncoding;
  body: Buffer;
}

const brotliAsync = promisify(brotliCompress);
const gzipAsync = promisify(gzip);

function parseAcceptEncoding(header: string): Map<string, number> {
  const weights = new Map<string, number>();

  for (const part of header.split(',')) {
    const segments = part.trim().split(';');
    const name = segments[0]?.trim().toLowerCase();
    if (!name) {
      continue;
    }

    let quality = 1;
    for (const segment of segments.slice(1)) {
      const [key, value] = segment.trim().split('=');
      if (key === 'q' && value !== undefined) {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
          quality = Math.min(1, Math.max(0, parsed));
        }
      }
    }
    weights.set(name, quality);
  }

  return weights;
}

function qualityFor(
  weights: Map<string, number>,
  encoding: string,
): number {
  const explicit = weights.get(encoding);
  if (explicit !== undefined) {
    return explicit;
  }
  return weights.get('*') ?? 0;
}

export async function compressForEncoding(
  text: string,
  acceptEncoding: string,
): Promise<CompressedPayload> {
  const weights = parseAcceptEncoding(acceptEncoding);
  const identityQuality = weights.get('identity') ?? 1;

  const candidates: Array<{ encoding: ContentEncoding; q: number }> = [
    { encoding: 'br', q: qualityFor(weights, 'br') },
    { encoding: 'gzip', q: qualityFor(weights, 'gzip') },
    { encoding: 'identity', q: identityQuality },
  ];
  const priority: Record<ContentEncoding, number> = {
    br: 0,
    gzip: 1,
    identity: 2,
  };

  const selected = candidates
    .filter((candidate) => candidate.q > 0)
    .sort((a, b) => b.q - a.q || priority[a.encoding] - priority[b.encoding])[0];

  if (!selected || selected.encoding === 'identity') {
    return { encoding: 'identity', body: Buffer.from(text, 'utf8') };
  }

  const source = Buffer.from(text, 'utf8');
  return {
    encoding: selected.encoding,
    body:
      selected.encoding === 'br'
        ? await brotliAsync(source)
        : await gzipAsync(source),
  };
}
