import { ImageResponse } from 'next/og';

export const alt =
  'Code / Color / Curiosity, the portfolio of Franyel Diaz Rodriguez';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '68px',
        color: '#142846',
        background:
          'linear-gradient(135deg, #f4e7c8 0%, #efc997 45%, #b6dceb 100%)',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', fontSize: 28, letterSpacing: 5 }}>
        FRANYEL DIAZ RODRIGUEZ
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontSize: 102, fontWeight: 700 }}>
          Code / Color
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: -16,
            fontSize: 102,
            fontStyle: 'italic',
          }}
        >
          / Curiosity
        </div>
      </div>
      <div style={{ display: 'flex', fontSize: 30, letterSpacing: 1 }}>
        Websites · Canvas experiments · Games
      </div>
    </div>,
    { ...size },
  );
}
