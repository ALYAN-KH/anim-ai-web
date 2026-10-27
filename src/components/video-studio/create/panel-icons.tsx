import type { ReactNode } from "react";
import { GLASS_SHADOW } from "./panel-styles";

type IconProps = { className?: string };

export function MixIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.16666 4.33334C1.16666 2.58444 2.58442 1.16667 4.33332 1.16667H9.33332C9.60946 1.16667 9.83332 1.39053 9.83332 1.66667C9.83332 1.94281 9.60946 2.16667 9.33332 2.16667H4.33332C3.13671 2.16667 2.16666 3.13672 2.16666 4.33334V9.33334C2.16666 9.60948 1.9428 9.83334 1.66666 9.83334C1.39051 9.83334 1.16666 9.60948 1.16666 9.33334V4.33334ZM3.83332 7C3.83332 5.2511 5.25109 3.83334 6.99999 3.83334H11.6667C13.4156 3.83334 14.8333 5.2511 14.8333 7V11.6667C14.8333 13.4156 13.4156 14.8333 11.6667 14.8333H6.99999C5.25109 14.8333 3.83332 13.4156 3.83332 11.6667V7ZM6.99999 4.83334C5.80337 4.83334 4.83332 5.80339 4.83332 7V11.6667C4.83332 12.8633 5.80337 13.8333 6.99999 13.8333H11.6667C12.8633 13.8333 13.8333 12.8633 13.8333 11.6667V7C13.8333 5.80339 12.8633 4.83334 11.6667 4.83334H6.99999ZM9.33332 6.5C9.60946 6.5 9.83332 6.72386 9.83332 7V8.83334H11.6667C11.9428 8.83334 12.1667 9.0572 12.1667 9.33334C12.1667 9.60948 11.9428 9.83334 11.6667 9.83334H9.83332V11.6667C9.83332 11.9428 9.60946 12.1667 9.33332 12.1667C9.05718 12.1667 8.83332 11.9428 8.83332 11.6667V9.83334H6.99999C6.72385 9.83334 6.49999 9.60948 6.49999 9.33334C6.49999 9.0572 6.72385 8.83334 6.99999 8.83334H8.83332V7C8.83332 6.72386 9.05718 6.5 9.33332 6.5Z"
      />
    </svg>
  );
}

export function SourceFramesIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M17.5 5.75h2.75a1 1 0 0 1 1 1v10.5a1 1 0 0 1-1 1H17.5m-11 0H3.75a1 1 0 0 1-1-1V6.75a1 1 0 0 1 1-1H6.5m10-2h-9a1 1 0 0 0-1 1v14.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V4.75a1 1 0 0 0-1-1"
      />
    </svg>
  );
}

export function SourceReferencesIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M3.75 5.75v12.5m4-13.5v14.5m4 .017V4.734a1 1 0 0 1 1.207-.979l6.5 1.374a1 1 0 0 1 .793.979v11.784a1 1 0 0 1-.793.979l-6.5 1.374a1 1 0 0 1-1.207-.979"
      />
    </svg>
  );
}

export function ChevronIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={`transform-none! rotate-0! ${className}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <g transform="rotate(-90 10 10)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.81344 7.97848C4.0087 7.78322 4.32528 7.78322 4.52055 7.97848L10.0003 13.4583L15.4801 7.97848C15.6754 7.78322 15.9919 7.78322 16.1872 7.97848C16.3825 8.17374 16.3825 8.49032 16.1872 8.68558L10.3539 14.5189L10.0003 14.8725L9.64677 14.5189L3.81344 8.68558C3.61818 8.49032 3.61818 8.17374 3.81344 7.97848Z"
        />
      </g>
    </svg>
  );
}

export function SpeakerWaveIcon({ className = "size-3.5" }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M19.2478 4.75195C21.1027 6.60684 22.25 9.16934 22.25 11.9998C22.25 14.8303 21.1027 17.3928 19.2478 19.2476M15.8891 8.11133C16.8844 9.10663 17.5 10.4816 17.5 12.0004C17.5 13.5192 16.8844 14.8942 15.8891 15.8895M2.75 7.75H5.7074C5.89846 7.75 6.08552 7.69526 6.24645 7.59227L12.25 3.75V20.25L6.24645 16.4077C6.08552 16.3047 5.89846 16.25 5.7074 16.25H2.75C2.19772 16.25 1.75 15.8023 1.75 15.25V8.75C1.75 8.19772 2.19772 7.75 2.75 7.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WanSvg({ className = "size-4" }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_17636_29841)">
        <path
          d="m19.936 12.141-2.312-4.046-.271-.478 1.224-2.14a.486.486 0 0 0 0-.478l-1.362-2.38a.473.473 0 0 0-.41-.239h-5.173L10.408.236a.468.468 0 0 0-.41-.239h-2.72a.465.465 0 0 0-.41.239l-2.315 4.05-.272.474H1.832a.465.465 0 0 0-.41.239L.065 7.382a.486.486 0 0 0 0 .478l2.587 4.523-1.225 2.144a.486.486 0 0 0 0 .478l1.362 2.38a.473.473 0 0 0 .41.239h5.17l1.224 2.144a.47.47 0 0 0 .41.239h2.72a.473.473 0 0 0 .41-.239l2.587-4.524h2.449a.465.465 0 0 0 .41-.239l1.361-2.38a.487.487 0 0 0 0-.477l-.003-.007ZM7.277.475 8.64 2.858l-1.362 2.38h10.89l-1.361 2.38H6.459L4.825 4.76 7.277.475Zm.816 16.665H3.194l1.362-2.383h2.721l-5.445-9.52h2.721l1.362 2.38 3.812 6.668-1.634 2.858v-.003Zm8.713-4.763-1.36-2.38-5.444 9.525-1.363-2.38 1.363-2.379 3.811-6.668h3.268l2.449 4.285h-2.724v-.003Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_17636_29841">
          <path fill="currentColor" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function GenerateSparkle() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m11.852 4.217-.13-.978a.476.476 0 0 0-.943 0l-.13.978A6.41 6.41 0 0 1 5.14 9.724l-.978.13a.476.476 0 0 0 0 .943l.978.13a6.41 6.41 0 0 1 5.507 5.508l.13.978a.476.476 0 0 0 .944 0l.13-.978a6.41 6.41 0 0 1 5.508-5.507l.977-.13a.476.476 0 0 0 0-.944l-.977-.13a6.41 6.41 0 0 1-5.508-5.507Zm-7.2 10.54.169-.549a.188.188 0 0 1 .36 0l.168.549a2.222 2.222 0 0 0 1.47 1.47l.549.169a.188.188 0 0 1 0 .36l-.549.168a2.222 2.222 0 0 0-1.47 1.47l-.169.549a.188.188 0 0 1-.36 0l-.168-.548a2.222 2.222 0 0 0-1.47-1.47l-.549-.17a.188.188 0 0 1 0-.36l.548-.168a2.222 2.222 0 0 0 1.47-1.47Z" />
    </svg>
  );
}

export type BadgeKind = "image" | "video" | "audio";

const BADGE_PATHS: Record<BadgeKind, ReactNode> = {
  image: (
    <>
      <path d="M9.941 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.781 18.34a8 8 0 0 0-.24-.82v-.03c-.82-2.5-1.67-4.46-2.54-5.81-.44-.67-.9-1.22-1.4-1.6-.51-.38-1.09-.62-1.72-.56-1.86.15-3.12 1.68-4.01 2.84-.12.16-.24.32-.35.46-.33.43-.61.81-.89 1.11-.39.42-.6.49-.69.49-.19 0-.41-.06-.72-.22-.27-.14-.55-.33-.88-.54-.04-.03-.09-.06-.13-.09-.72-.47-1.68-1.1-2.84-1.1-.61 0-1.14.27-1.57.62-.42.35-.78.82-1.09 1.31-.62.98-1.1 2.2-1.43 3.18v.03c-.1.27-.19.53-.24.75-.06.25-.08.52 0 .82.1.42.39.82.76 1.05.26.17.54.23.8.25.24.02.52.02.83.02h15.92c.33 0 .63 0 .88-.02.26-.02.55-.08.82-.25.37-.24.65-.62.76-1.04.08-.31.04-.59-.01-.85z"
      />
    </>
  ),
  video: (
    <path d="M15.75 4.5c.966 0 1.75.784 1.75 1.75v11.5a1.75 1.75 0 0 1-1.75 1.75h-12A1.75 1.75 0 0 1 2 17.75V6.25c0-.966.784-1.75 1.75-1.75zM20.443 7.215A1.5 1.5 0 0 1 22.5 8.607v6.786a1.5 1.5 0 0 1-2.057 1.392l-1.943-.777V7.992z" />
  ),
  audio: (
    <path d="M13 3.75a.75.75 0 0 0-1.154-.632L5.842 6.961A.25.25 0 0 1 5.707 7H2.75A1.75 1.75 0 0 0 1 8.75v6.5c0 .966.784 1.75 1.75 1.75h2.957a.25.25 0 0 1 .135.04l6.004 3.842A.75.75 0 0 0 13 20.25zM18.718 4.222a.75.75 0 0 1 1.06 0A10.97 10.97 0 0 1 23 12c0 3.037-1.232 5.788-3.222 7.778a.75.75 0 1 1-1.06-1.06A9.47 9.47 0 0 0 21.5 12a9.47 9.47 0 0 0-2.782-6.718.75.75 0 0 1 0-1.06M16.42 7.581a.75.75 0 0 0-1.061 1.06 4.73 4.73 0 0 1 1.391 3.36c0 1.311-.53 2.498-1.391 3.358a.75.75 0 1 0 1.06 1.06A6.23 6.23 0 0 0 18.25 12c0-1.725-.7-3.289-1.83-4.419" />
  ),
};

export function GlassBadge({
  kind,
  gradientId,
  overlap = false,
}: {
  kind: BadgeKind;
  gradientId: string;
  overlap?: boolean;
}) {
  return (
    <span
      className={`relative flex size-9 shrink-0 items-center justify-center ${overlap ? "-ml-2" : ""
        }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-surface-primary"
      />
      <span
        aria-hidden="true"
        className={`backdrop-blur-xs absolute inset-0 rounded-full border border-[rgba(197,197,197,0.30)] bg-white/4 mix-blend-luminosity ${GLASS_SHADOW}`}
      />
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="relative size-4 shrink-0"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="12"
            y1="24"
            x2="12"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="1" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
        </defs>
        <g fill={`url(#${gradientId})`}>{BADGE_PATHS[kind]}</g>
      </svg>
    </span>
  );
}
