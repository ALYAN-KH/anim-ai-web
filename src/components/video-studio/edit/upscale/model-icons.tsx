"use client";


export function FluxIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 21h-2.122l-9.83-14.736-8.682 12.912h12.22L16.78 21H0L12.024 3 24 21Z"
        fill="currentColor"
      />
      <path
        d="M20.39 21h-2.122l-4.825-7.252-.906-1.436h2.122L20.39 21Zm-8.146-3.888H8l2.122-3.215 2.122 3.215Zm7.512-4.992 2.17-3.168L24 12.12h-4.244Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TopazIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <rect x="14" y="5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="5" y="14" width="5" height="5" rx="1" />
    </svg>
  );
}

export function BytedanceIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <rect x="3.5" y="10" width="3" height="8" rx="1" />
      <rect x="8.5" y="6" width="3" height="12" rx="1" />
      <rect x="13.5" y="9" width="3" height="9" rx="1" />
      <rect x="18.5" y="7" width="2" height="11" rx="1" />
    </svg>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
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
        d="M5 13.875 9.2 18 19 7"
      />
    </svg>
  );
}

export function DownChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.81344 7.97848C4.0087 7.78322 4.32528 7.78322 4.52055 7.97848L10.0003 13.4583L15.4801 7.97848C15.6754 7.78322 15.9919 7.78322 16.1872 7.97848C16.3825 8.17374 16.3825 8.49032 16.1872 8.68558L10.3539 14.5189L10.0003 14.8725L9.64677 14.5189L3.81344 8.68558C3.61818 8.49032 3.61818 8.17374 3.81344 7.97848Z"
        fill="currentColor"
      />
    </svg>
  );
}

export type ModelIcon = (props: { className?: string }) => ReturnType<typeof FluxIcon>;
