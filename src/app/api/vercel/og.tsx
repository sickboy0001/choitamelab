import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default function () {
  return new ImageResponse(
    (
      <div style={{ fontSize: 128, background: 'white', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        こんにちは、世界！
      </div>
    ),
    { width: 1200, height: 630 }
  );
}