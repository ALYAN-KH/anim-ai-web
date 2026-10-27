import {
  BookOpen,
  ChevronRight,
  Clock3,
  Folder,
  Image,
  List,
  Music2,
  Pencil,
  Search,
  Sparkles,
  Video,
  Volume2,
} from "lucide-react";
import type { ReactNode } from "react";
import type { GlyphKind } from "../types";

export type IconProps = {
  className?: string;
};

/* Re-exported Lucide Icons */
export const FolderIcon = Folder;
export const BookIcon = BookOpen;
export function ExpandIcon({ className = "size-3.5" }: IconProps) {
  return <Stroke className={className}><path d="M5.75 12.75V17.25C5.75 17.8023 6.19772 18.25 6.75 18.25H11.25M12.75 5.75H17.25C17.8023 5.75 18.25 6.19772 18.25 6.75V11.25" /></Stroke>;
}
export function CropIcon({ className = "size-3.5" }: IconProps) {
  return <Stroke className={className}><path d="M2.75 5.75H17.25C17.8023 5.75 18.25 6.19772 18.25 6.75V21.25M5.75 2.75V17.25C5.75 17.8023 6.19772 18.25 6.75 18.25H21.25" /></Stroke>;
}
export function SortIcon({ className = "size-4" }: IconProps) {
  return <Stroke className={className}><path d="M3.75 5.75H18.25" /><path d="M3.75 12H11.25" /><path d="M3.75 18.25H9.25" /><path d="M18 10.75V18.5M14.75 15.75L18 19L21.25 15.75" /></Stroke>;
}
export const ListIcon = List;
export function FilterIcon({ className = "size-4" }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 4.75C2 4.33579 2.33579 4 2.75 4H21.25C21.6642 4 22 4.33579 22 4.75C22 5.16421 21.6642 5.5 21.25 5.5H2.75C2.33579 5.5 2 5.16421 2 4.75ZM5 12C5 11.5858 5.33579 11.25 5.75 11.25H18.25C18.6642 11.25 19 11.5858 19 12C19 12.4142 18.6642 12.75 18.25 12.75H5.75C5.33579 12.75 5 12.4142 5 12ZM8 19.25C8 18.8358 8.33579 18.5 8.75 18.5H15.25C15.6642 18.5 16 18.8358 16 19.25C16 19.6642 15.6642 20 15.25 20H8.75C8.33579 20 8 19.6642 8 19.25Z"
      />
    </svg>
  );
}

export function GridIcon({ className = "size-4" }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M3.75 5.35C3.75 4.78995 3.75 4.50992 3.85899 4.29601C3.95487 4.10785 4.10785 3.95487 4.29601 3.85899C4.50992 3.75 4.78995 3.75 5.35 3.75H10.25V10.25H3.75V5.35Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.75 3.75H18.65C19.2101 3.75 19.4901 3.75 19.704 3.85899C19.8922 3.95487 20.0451 4.10785 20.141 4.29601C20.25 4.50992 20.25 4.78995 20.25 5.35V10.25H13.75V3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.75 13.75H10.25V20.25H5.35C4.78995 20.25 4.50992 20.25 4.29601 20.141C4.10785 20.0451 3.95487 19.8922 3.85899 19.704C3.75 19.4901 3.75 19.2101 3.75 18.65V13.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.75 13.75H20.25V18.65C20.25 19.2101 20.25 19.4901 20.141 19.704C20.0451 19.8922 19.8922 20.0451 19.704 20.141C19.4901 20.25 19.2101 20.25 18.65 20.25H13.75V13.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export const SpeakerIcon = Volume2;
export const ClockIcon = Clock3;
export const FrameImageIcon = Image;
export const PencilIcon = Pencil;
export const SparkleIcon = Sparkles;
export const ChevronRightIcon = ChevronRight;
export const SearchIcon = Search;
export const MusicIcon = Music2;
export const VideoIcon = Video;

/* Custom Stroke SVG Wrapper */
export function Stroke({
  className = "size-4",
  width = 1.5,
  children,
}: IconProps & {
  width?: number;
  children: ReactNode;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function RatioIcon({ className }: IconProps) {
  return (
    <Stroke className={className} width={2}>
      <path d="M4.75 3.75C4.75 3.19772 5.19772 2.75 5.75 2.75H18.25C18.8023 2.75 19.25 3.19772 19.25 3.75V20.25C19.25 20.8023 18.8023 21.25 18.25 21.25H5.75C5.19771 21.25 4.75 20.8023 4.75 20.25V3.75Z" />
    </Stroke>
  );
}

export function GemIcon({
  className,
  width = 2,
}: IconProps & { width?: number }) {
  return (
    <Stroke className={className} width={width}>
      <path d="M8.5 7.75L6.25 10L8.5 12.25M12.7071 20.0429L22.049 10.701C22.4371 10.3129 22.4398 9.68443 22.0551 9.29295L16.901 4.04903C16.713 3.85774 16.4561 3.75 16.1879 3.75H7.81214C7.54393 3.75 7.28696 3.85774 7.09895 4.04903L1.94493 9.29295C1.56016 9.68443 1.56288 10.3129 1.95102 10.701L11.2929 20.0429C11.6834 20.4334 12.3166 20.4334 12.7071 20.0429Z" />
    </Stroke>
  );
}

export function WanLogo({ className = "size-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m19.936 12.141-2.312-4.046-.271-.478 1.224-2.14a.486.486 0 0 0 0-.478l-1.362-2.38a.473.473 0 0 0-.41-.239h-5.173L10.408.236a.468.468 0 0 0-.41-.239h-2.72a.465.465 0 0 0-.41.239l-2.315 4.05-.272.474H1.832a.465.465 0 0 0-.41.239L.065 7.382a.486.486 0 0 0 0 .478l2.587 4.523-1.225 2.144a.486.486 0 0 0 0 .478l1.362 2.38a.473.473 0 0 0 .41.239h5.17l1.224 2.144a.47.47 0 0 0 .41.239h2.72a.473.473 0 0 0 .41-.239l2.587-4.524h2.449a.465.465 0 0 0 .41-.239l1.361-2.38a.487.487 0 0 0 0-.477l-.003-.007Z" />
    </svg>
  );
}

export function Glyph({ kind }: { kind: GlyphKind }) {
  return (
    <Stroke className="size-[18px]">
      {kind === "grok" && (
        <>
          <circle cx="10" cy="10" r="6" />
          <path d="m6 14 8-8" />
        </>
      )}
      {kind === "kling" && (
        <path d="M6.5 6.5c2-2 5-1 5 1.5s-3 2.5-3 5 3 3.5 5 1.5M13.5 13.5c-2 2-5 1-5-1.5" />
      )}
      {kind === "wan" && <path d="m4 6 3 8 3-6 3 6 3-8" />}
      {kind === "wave" && <path d="M4 10v0M7 7v6M10 4.5v11M13 7.5v5M16 9v2" />}
      {kind === "tri" && <path d="M10 4 16.5 15h-13L10 4Zm0 4.5L7 13.5" />}
    </Stroke>
  );
}
