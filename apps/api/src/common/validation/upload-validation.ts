const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'image/vnd.adobe.photoshop',
  'application/zip',
  'application/x-zip-compressed',
]);

const MAGIC: Array<{ mime: string; bytes: number[] }> = [
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] },
  { mime: 'application/zip', bytes: [0x50, 0x4b, 0x03, 0x04] },
];

export function assertAllowedUpload(mimeType: string, byteSize: number) {
  if (!ALLOWED_MIME.has(mimeType)) {
    throw new Error(`MIME type not allowed: ${mimeType}`);
  }
  const max = Number(process.env.UPLOAD_MAX_BYTES ?? 500_000_000);
  if (byteSize > max) {
    throw new Error(`File exceeds max size of ${max} bytes`);
  }
}

export function sniffMime(buffer: Buffer): string | null {
  for (const rule of MAGIC) {
    if (rule.bytes.every((b, i) => buffer[i] === b)) return rule.mime;
  }
  return null;
}
