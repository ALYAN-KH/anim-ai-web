export function ElementsPanel() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center p-6">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-neutral-primary-reverted-5 text-icon-secondary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14),0_6.833px_6.833px_rgba(0,0,0,0.08),inset_0_4px_8px_rgba(255,255,255,0.2)]">
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-white/20 mix-blend-overlay" />
          <svg
            className="relative size-6"
            aria-hidden="true"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.8684 19.8667C15.4543 20.7437 13.7863 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 13.9797 20.2662 16.0242 17.9715 15.8156C16.0837 15.644 14.7249 13.9258 14.993 12.0492L15.5226 8.40278M14.9375 12.4805C14.63 14.6681 12.8291 16.2235 10.9149 15.9544C9.00068 15.6854 7.69817 13.6939 8.00562 11.5063C8.31308 9.31862 10.1141 7.76327 12.0283 8.03229C13.9424 8.30131 15.245 10.2928 14.9375 12.4805Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex w-full flex-col items-center gap-1.5">
          <p className="min-w-full text-center text-[16px] font-semibold leading-5 text-font-primary">
            No elements yet
          </p>
          <p className="max-w-[16.5rem] text-balance text-center text-[12px] font-medium leading-4 tracking-normal text-font-secondary">
            Reuse your characters, locations, and props across every generation
          </p>
        </div>
      </div>
    </div>
  );
}
