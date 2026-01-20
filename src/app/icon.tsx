import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 28,
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 4L18 10L14 16L10 10L14 4Z"
            fill="white"
            opacity="0.9"
          />
          <circle
            cx="14"
            cy="20"
            r="3"
            fill="white"
            opacity="0.7"
          />
          <path
            d="M14 2L20 12L14 22L8 12L14 2Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
