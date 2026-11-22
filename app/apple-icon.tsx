import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 22% 20%, rgba(124, 92, 255, 0.34), transparent 58%), radial-gradient(circle at 85% 85%, rgba(79, 227, 193, 0.24), transparent 58%), #07070B",
          borderRadius: 40,
          border: "4px solid rgba(124, 92, 255, 0.55)",
        }}
      >
        <svg width="124" height="124" viewBox="0 0 64 64" fill="none">
          <path
            d="M15 44V20L29 44V20"
            stroke="#F4F4F6"
            strokeWidth="4.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M48 23.5C48 21 45.4 19.5 42 19.5C38.6 19.5 36.2 21.2 36.2 23.8C36.2 26.6 38.8 27.9 42.3 28.9C45.8 29.9 48.4 31.3 48.4 34.8C48.4 38.2 45.6 40.5 41.8 40.5C38.2 40.5 35.8 38.8 35.3 36"
            stroke="#4FE3C1"
            strokeWidth="4.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 50H49"
            stroke="#7C5CFF"
            strokeOpacity="0.65"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
