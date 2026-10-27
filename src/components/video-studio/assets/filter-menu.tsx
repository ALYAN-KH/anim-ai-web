import {
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";

export type SortKey = "last-created" | "last-used" | "first-created";
export type MediaFilter = "all" | "images" | "videos" | "audio";

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function CheckIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M5 12.5 9.5 17 19 7.5" />
    </Svg>
  );
}

function LastCreatedIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7.75 3.75v2.5M15.75 3.75v2.5M3.75 9.25h16.5M12 20.25H6.25a2 2 0 0 1-2-2V7.25a2 2 0 0 1 2-2h11.5a2 2 0 0 1 2 2V12" />
      <circle cx="17" cy="17.5" r="3.25" />
      <path d="M17 15.75v1.9l1.2.7" />
    </Svg>
  );
}

function LastUsedIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.75 12a8.25 8.25 0 1 0 2.45-5.85L3.75 8.5M3.75 3.75V8.5H8.5M12 7.75V12l3 1.75" />
    </Svg>
  );
}

function FirstCreatedIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7 4.5v15M3.75 16.25 7 19.5l3.25-3.25M14.5 6.25l1.5-1v6M14.5 15.5c0-1 .75-1.75 1.75-1.75S18 14.5 18 15.5c0 1.5-3.5 2.25-3.5 4H18" />
    </Svg>
  );
}

function ImageIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6.25 4.75h11.5a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H6.25a2 2 0 0 1-2-2V6.75a2 2 0 0 1 2-2ZM4.75 16.5l4-4 3.5 3.5 2.5-2.5 4.5 4.5" />
      <circle cx="15.5" cy="9.75" r="1" />
    </Svg>
  );
}

function VideoIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.75 7.75a2 2 0 0 1 2-2h7.5a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-7.5a2 2 0 0 1-2-2v-8.5ZM15.25 10.5l4.25-2.25a.5.5 0 0 1 .75.45v6.6a.5.5 0 0 1-.75.45l-4.25-2.25" />
    </Svg>
  );
}

function AudioIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M9 18.25V6.5l10-2v11.75" />
      <circle cx="6.5" cy="18.25" r="2.5" />
      <circle cx="16.5" cy="16.25" r="2.5" />
    </Svg>
  );
}

function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-2.5 pb-1 pt-2 text-xs font-medium text-white/50">
      {children}
    </p>
  );
}

function MenuItem({
  icon,
  label,
  checked,
  onSelect,
}: {
  icon?: ReactNode;
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      onClick={onSelect}
      className="flex h-9 w-full items-center gap-2.5 rounded-xl px-2.5 text-left text-sm font-medium text-white outline-none transition-colors hover:bg-white/10 focus:bg-white/10"
    >
      {icon}
      <span className="truncate">{label}</span>
      {checked && (
        <CheckIcon className="ml-auto size-4 shrink-0 text-[var(--hf-color-brand-primary,#EFFE17)]" />
      )}
    </button>
  );
}

export interface FilterMenuProps {
  sort: SortKey;
  media: MediaFilter;
  onSortChange: (sort: SortKey) => void;
  onMediaChange: (media: MediaFilter) => void;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
}

const SORT_OPTIONS: { key: SortKey; label: string; Icon: typeof LastUsedIcon }[] =
  [
    { key: "last-created", label: "Last created", Icon: LastCreatedIcon },
    { key: "last-used", label: "Last used", Icon: LastUsedIcon },
    { key: "first-created", label: "First created", Icon: FirstCreatedIcon },
  ];

const MEDIA_OPTIONS: {
  key: MediaFilter;
  label: string;
  Icon?: typeof ImageIcon;
}[] = [
    { key: "all", label: "All media" },
    { key: "images", label: "Images", Icon: ImageIcon },
    { key: "videos", label: "Videos", Icon: VideoIcon },
    { key: "audio", label: "Audio", Icon: AudioIcon },
  ];

export function FilterMenu({
  sort,
  media,
  onSortChange,
  onMediaChange,
  onClose,
  triggerRef,
}: FilterMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    menuRef.current
      ?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')
      ?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [onClose, triggerRef]);

  const onMenuKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitemradio"]',
      ) ?? [],
    );
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      e.key === "ArrowDown"
        ? (index + 1) % items.length
        : (index - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      onKeyDown={onMenuKeyDown}
      className="hide-scrollbar absolute right-2 top-[46px] z-20 max-h-[calc(100%-52px)] w-[186px] overflow-y-auto rounded-2xl border border-white/10 bg-[#2a2c2e]/95 p-1.5 shadow-xl backdrop-blur-xl"
    >
      <MenuLabel>Sort by</MenuLabel>
      {SORT_OPTIONS.map(({ key, label, Icon }) => (
        <MenuItem
          key={key}
          icon={<Icon className="size-4 shrink-0" />}
          label={label}
          checked={sort === key}
          onSelect={() => {
            onSortChange(key);
            onClose();
          }}
        />
      ))}
      <MenuLabel>Filter by</MenuLabel>
      {MEDIA_OPTIONS.map(({ key, label, Icon }) => (
        <MenuItem
          key={key}
          icon={Icon ? <Icon className="size-4 shrink-0" /> : undefined}
          label={label}
          checked={media === key}
          onSelect={() => {
            onMediaChange(key);
            onClose();
          }}
        />
      ))}
    </div>
  );
}
