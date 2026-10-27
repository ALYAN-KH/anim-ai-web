import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps): IconProps => ({
  "aria-hidden": true,
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
});

export function FolderIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        d="M2.75 4.75V18.25C2.75 18.8023 3.19772 19.25 3.75 19.25H20.25C20.8023 19.25 21.25 18.8023 21.25 18.25V7.75C21.25 7.19772 20.8023 6.75 20.25 6.75H12.5352C12.2008 6.75 11.8886 6.5829 11.7031 6.3047L10.2969 4.1953C10.1114 3.9171 9.79917 3.75 9.46482 3.75H3.75C3.19772 3.75 2.75 4.19772 2.75 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        d="M12 7.75C12 6.09315 13.3431 4.75 15 4.75H21.25C21.8023 4.75 22.25 5.19772 22.25 5.75V18.25C22.25 18.8023 21.8023 19.25 21.25 19.25H15.277C14.5966 19.25 13.9296 19.4142 13.3508 19.7719C12.772 20.1296 12.3043 20.6414 12 21.25M12 7.75C12 6.09315 10.6569 4.75 9 4.75H2.75C2.19772 4.75 1.75 5.19772 1.75 5.75V18.25C1.75 18.8023 2.19772 19.25 2.75 19.25H8.723C9.40341 19.25 10.0704 19.4142 10.6492 19.7719C11.228 20.1296 11.6957 20.6414 12 21.25M12 7.75V21.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        d="M2.75 4.75H21.25M8.75 19.25H15.25M5.75 12H18.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WaveformIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" {...base(props)}>
      <path
        d="M2.5 6.5v3M5.75 4.5v7M9 2.75v10.5M12.25 5v6M15 6.75v2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MusicIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        d="M19.1835 3.83539C19.3432 3.78977 19.5022 3.90968 19.5022 4.07577V13.15C18.8575 12.7352 18.0658 12.5001 17.2522 12.5001C15.315 12.5001 13.5022 13.833 13.5022 15.7501C13.5022 17.6673 15.315 19.0001 17.2522 19.0001C19.1894 19.0001 21.0022 17.6673 21.0022 15.7501V4.07577C21.0022 2.91315 19.8894 2.07374 18.7715 2.39308L10.2693 4.82177C9.51801 5.03639 9 5.72309 9 6.50446V16.15C8.35535 15.7352 7.56365 15.5001 6.75 15.5001C4.81278 15.5001 3 16.833 3 18.7501C3 20.6673 4.81278 22.0001 6.75 22.0001C8.68722 22.0001 10.5 20.6673 10.5 18.7501V6.50446C10.5 6.39284 10.574 6.29474 10.6813 6.26408L19.1835 3.83539Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        d="M14.25 6.75C13.0074 6.75 12 7.75736 12 9C12 10.2426 13.0074 11.25 14.25 11.25C15.4926 11.25 16.5 10.2426 16.5 9C16.5 7.75736 15.4926 6.75 14.25 6.75Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 4.75C3 3.7835 3.7835 3 4.75 3H19.25C20.2165 3 21 3.7835 21 4.75V19.25C21 20.2165 20.2165 21 19.25 21H4.75C3.7835 21 3 20.2165 3 19.25V4.75ZM19.5 18.4394L14.8839 13.8232C14.3957 13.3351 13.6043 13.3351 13.1161 13.8232L12.1768 14.7626C12.0791 14.8602 11.9209 14.8602 11.8232 14.7626L8.87333 11.8127C8.3956 11.3349 7.62472 11.3233 7.13274 11.7863L4.5 14.2642V4.75C4.5 4.61193 4.61193 4.5 4.75 4.5H19.25C19.3881 4.5 19.5 4.61193 19.5 4.75V18.4394Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function VideoIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        d="M2.75 6.75C2.75 5.64543 3.64543 4.75 4.75 4.75H13.25C14.3546 4.75 15.25 5.64543 15.25 6.75V17.25C15.25 18.3546 14.3546 19.25 13.25 19.25H4.75C3.64543 19.25 2.75 18.3546 2.75 17.25V6.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M15.25 10L19.8028 7.72361C20.4677 7.39116 21.25 7.87465 21.25 8.61803V15.382C21.25 16.1253 20.4677 16.6088 19.8028 16.2764L15.25 14V10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        d="M10.75 11H12L12 16.25M21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.375C11.6548 7.375 11.375 7.65482 11.375 8C11.375 8.34518 11.6548 8.625 12 8.625C12.3452 8.625 12.625 8.34518 12.625 8C12.625 7.65482 12.3452 7.375 12 7.375Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.25"
      />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.46967 8.46967C3.76256 8.17678 4.23744 8.17678 4.53033 8.46967L12 15.9393L19.4697 8.46967C19.7626 8.17678 20.2374 8.17678 20.5303 8.46967C20.8232 8.76256 20.8232 9.23744 20.5303 9.53033L12.5303 17.5303C12.3897 17.671 12.1989 17.75 12 17.75C11.8011 17.75 11.6103 17.671 11.4697 17.5303L3.46967 9.53033C3.17678 9.23744 3.17678 8.76256 3.46967 8.46967Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path d="M6.75 12H17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        d="M12 6.75V12M12 12V17.25M12 12H6.75M12 12H17.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SlidersIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
        d="M11.5 7.25H3.75m1.75 9.5H3.75m16.5-9.5H18.5m1.75 9.5H12.5M9 20a3.25 3.25 0 1 0 0-6.5A3.25 3.25 0 1 0 9 20Zm6-9.5A3.25 3.25 0 1 0 15 4a3.25 3.25 0 1 0 0 6.5Z"
      />
    </svg>
  );
}

export function SeedMark(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" {...base(props)}>
      <path
        d="m3.154 12.154-2.62.655V1.2l2.62.655v10.3Zm12.668.679-2.626.656V.519l2.627.65v11.664Zm-8.509-.325-2.622.656v-6.84l2.622.655v5.53ZM9.025 5.31l2.627-.656v6.84l-2.627-.656V5.31Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HelpIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 15.75c0-4.25 4.25-3.317 4.25-6.976 0-4.987-7.385-5.446-8.388-.774"
      />
      <path fill="currentColor" d="M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
    </svg>
  );
}

export function ResetIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        d="M19.25 12A7.25 7.25 0 1 1 16.9 6.65M19.25 4.75v4h-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        d="M6.75 12.75L10 16L17.25 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        d="M6.75 6.75L17.25 17.25M17.25 6.75L6.75 17.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        d="M19.25 12H4.75M4.75 12L11 5.75M4.75 12L11 18.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FileDownIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        d="M13.75 3.75H7.75C6.64543 3.75 5.75 4.64543 5.75 5.75V18.25C5.75 19.3546 6.64543 20.25 7.75 20.25H16.25C17.3546 20.25 18.25 19.3546 18.25 18.25V8.25L13.75 3.75ZM13.75 3.75V8.25H18.25M12 11.75V16.25M12 16.25L10.25 14.5M12 16.25L13.75 14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <rect x="3.75" y="3.75" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13.25" y="3.75" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3.75" y="13.25" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13.25" y="13.25" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function VideoPlusIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 3.75C2 2.7835 2.7835 2 3.75 2H14.25C15.2165 2 16 2.7835 16 3.75V8H20.25C21.2165 8 22 8.7835 22 9.75V20.25C22 21.2165 21.2165 22 20.25 22H9.75C8.7835 22 8 21.2165 8 20.25V16H3.75C2.7835 16 2 15.2165 2 14.25V3.75ZM14.5 8V3.75C14.5 3.61193 14.3881 3.5 14.25 3.5H3.75C3.61193 3.5 3.5 3.61193 3.5 3.75V10.7413L5.03616 9.73485C5.62284 9.35047 6.38234 9.35351 6.96593 9.74257L8 10.4319V9.75C8 8.7835 8.7835 8 9.75 8H14.5ZM5 6.25C5 5.55964 5.55964 5 6.25 5C6.94036 5 7.5 5.55964 7.5 6.25C7.5 6.94036 6.94036 7.5 6.25 7.5C5.55964 7.5 5 6.94036 5 6.25ZM13.3906 12.5417C13.6314 12.4102 13.9248 12.4208 14.1556 12.5691L16.9556 14.3691C17.1702 14.5071 17.3 14.7448 17.3 15C17.3 15.2552 17.1702 15.4929 16.9556 15.6309L14.1556 17.4309C13.9248 17.5792 13.6314 17.5898 13.3906 17.4583C13.1498 17.3268 13 17.0744 13 16.8V13.2C13 12.9256 13.1498 12.6732 13.3906 12.5417Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...base(props)}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3a.75.75 0 0 1 .53.22l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V15a.75.75 0 0 1-1.5 0V5.56L8.03 8.78a.75.75 0 0 1-1.06-1.06l4.5-4.5A.75.75 0 0 1 12 3"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 14a.75.75 0 0 1 .75.75v4.5c0 .138.112.25.25.25h14.5a.25.25 0 0 0 .25-.25v-4.5a.75.75 0 0 1 1.5 0v4.5A1.75 1.75 0 0 1 19.25 21H4.75A1.75 1.75 0 0 1 3 19.25v-4.5a.75.75 0 0 1 .75-.75"
      />
    </svg>
  );
}

export function VoiceBarsIcon(props: IconProps) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" {...base(props)}>
      <path
        d="M16.4584 13.125V26.875M13.125 18.125V21.875M20 16.4584V23.5417M23.5417 14.7917V25.2084M26.875 18.125V21.875"
        stroke="url(#audio-voice-level-bars)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="audio-voice-level-bars"
          x1="20"
          y1="13.125"
          x2="20"
          y2="26.875"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RightChevronIcon(props: IconProps) { return <svg width="16" height="16" viewBox="0 0 24 24" {...base(props)}><path d="m9.5 5.75 6.25 6.25-6.25 6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
