export function encodeMessage(text: string): Buffer {
  const payload = Buffer.from(text, 'utf8');
  const header = Buffer.alloc(4);
  header.writeUInt32BE(payload.length, 0);
  return Buffer.concat([header, payload]);
}

export function decodeMessage(data: Buffer): string {
  if (data.length < 4) {
    throw new Error('消息头不完整');
  }

  const payloadLength = data.readUInt32BE(0);
  if (data.length < 4 + payloadLength) {
    throw new Error('消息体不完整');
  }
  if (data.length > 4 + payloadLength) {
    throw new Error('消息包含多余字节');
  }

  return data.subarray(4, 4 + payloadLength).toString('utf8');
}
