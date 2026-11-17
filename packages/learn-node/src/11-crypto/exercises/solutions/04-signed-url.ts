import { createHmac, timingSafeEqual } from 'node:crypto';

export interface CreateSignedUrlOptions {
  method?: string;
  expiresInSeconds?: number;
  now?: () => number;
}

export interface VerifySignedUrlOptions {
  method?: string;
  now?: () => number;
}

export type VerifyFailureReason = 'missing' | 'invalid' | 'expired' | 'signature';

export interface VerifyResult {
  valid: boolean;
  reason?: VerifyFailureReason;
}

function currentSeconds(now?: () => number): number {
  return now ? now() : Math.floor(Date.now() / 1000);
}

function sign(
  secret: string,
  method: string,
  pathname: string,
  expires: number,
): string {
  return createHmac('sha256', secret)
    .update(`${method.toUpperCase()}\n${pathname}\n${expires}`, 'utf8')
    .digest('base64url');
}

export function createSignedUrl(
  url: string,
  secret: string,
  options: CreateSignedUrlOptions = {},
): string {
  if (!secret) {
    throw new Error('secret 不能为空');
  }

  const expiresInSeconds = options.expiresInSeconds ?? 300;
  if (!Number.isInteger(expiresInSeconds) || expiresInSeconds <= 0) {
    throw new RangeError('expiresInSeconds 必须是正整数');
  }

  const parsed = new URL(url);
  const method = (options.method ?? 'GET').toUpperCase();
  const expires = currentSeconds(options.now) + expiresInSeconds;

  parsed.searchParams.set('expires', String(expires));
  parsed.searchParams.set(
    'signature',
    sign(secret, method, parsed.pathname, expires),
  );
  return parsed.toString();
}

export function verifySignedUrl(
  url: string,
  secret: string,
  options: VerifySignedUrlOptions = {},
): VerifyResult {
  if (!secret) {
    throw new Error('secret 不能为空');
  }

  const parsed = new URL(url);
  const expiresRaw = parsed.searchParams.get('expires');
  const signature = parsed.searchParams.get('signature');

  if (!expiresRaw || !signature) {
    return { valid: false, reason: 'missing' };
  }

  const expires = Number(expiresRaw);
  if (!Number.isInteger(expires) || expires < 0) {
    return { valid: false, reason: 'invalid' };
  }
  if (expires <= currentSeconds(options.now)) {
    return { valid: false, reason: 'expired' };
  }

  const method = (options.method ?? 'GET').toUpperCase();
  const expected = Buffer.from(
    sign(secret, method, parsed.pathname, expires),
    'utf8',
  );
  const received = Buffer.from(signature, 'utf8');

  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return { valid: false, reason: 'signature' };
  }

  return { valid: true };
}
