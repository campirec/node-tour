import { createHmac, timingSafeEqual } from 'node:crypto';

export function signPayload(payload: string, secret: string): string {
  if (!secret) {
    throw new Error('secret 不能为空');
  }
  return createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
}

export function verifySignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const expected = Buffer.from(signPayload(payload, secret), 'utf8');
  const received = Buffer.from(signature, 'utf8');

  if (expected.length !== received.length) {
    return false;
  }
  return timingSafeEqual(expected, received);
}
