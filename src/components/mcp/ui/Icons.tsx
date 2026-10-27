import type { SVGProps } from "react";
import {
  Aperture,
  Bot,
  Box,
  Camera,
  Check,
  Circle,
  Copy,
  DollarSign,
  Flame,
  Megaphone,
  Play,
  Search,
  UserRound,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { mcpMenuIcons } from "@/data/content/mcp-navigation";
import type { AgentId } from "../types";

type IconProps = SVGProps<SVGSVGElement>;
type IconComponent = (props: IconProps) => JSX.Element;

function NavigationIcon({ name, className = "" }: IconProps & { name: string }) {
  const markup = mcpMenuIcons[`mcp-reference-${name}`];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex [&_svg]:size-full ${className}`}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

export function ChatGptIcon({ className = "" }: IconProps) {
  return <NavigationIcon name="0" className={className} />;
}

export function ClaudeIcon({ className = "" }: IconProps) {
  return <NavigationIcon name="1" className={className} />;
}

export function ClaudeCodeIcon({ className = "" }: IconProps) {
  return <NavigationIcon name="2" className={className} />;
}

export function TelegramIcon({ className = "" }: IconProps) {
  return <NavigationIcon name="3" className={className} />;
}

export function CliIcon({ className = "" }: IconProps) {
  return <NavigationIcon name="4" className={className} />;
}

export function OtherIcon({ className = "" }: IconProps) {
  return <Bot className={className} aria-hidden="true" />;
}

export const AGENT_ICONS: Record<AgentId, IconComponent> = {
  chatgpt: ChatGptIcon,
  claude: ClaudeIcon,
  "claude-code": ClaudeCodeIcon,
  telegram: TelegramIcon,
  cli: CliIcon,
  other: OtherIcon,
};

export const AGENT_ICON_COLOR: Record<AgentId, string> = {
  chatgpt: "text-current",
  claude: "text-[#d97757]",
  "claude-code": "text-[#d97757]",
  telegram: "text-[#229ed9]",
  cli: "text-current",
  other: "text-current",
};

export function HiggsfieldMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[14px] bg-[#d1fe17] text-black ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[70%]" aria-hidden>
        <path
          d="M7 17.5c-2.2-1.2-2.6-3.7-.9-5.2 1.3-1.2 3.3-1.4 5-.5 1.7.9 3.6.7 4.9-.5 1.6-1.5 1.2-4-1-5.2"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path d="M5 20.5h5M14 3.5h5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function SearchIcon(props: IconProps) {
  return <Search {...props} aria-hidden="true" />;
}

export function CopyIcon(props: IconProps) {
  return <Copy {...props} aria-hidden="true" />;
}

export function CheckIcon(props: IconProps) {
  return <Check {...props} aria-hidden="true" />;
}

export function CloseIcon(props: IconProps) {
  return <X {...props} aria-hidden="true" />;
}

export function VolumeIcon({ muted, ...props }: IconProps & { muted?: boolean }) {
  const Icon = muted ? VolumeX : Volume2;
  return <Icon {...props} aria-hidden="true" />;
}

const CATEGORY_ICONS = {
  flame: Flame,
  dollar: DollarSign,
  motion: Circle,
  marketing: Megaphone,
  camera: Camera,
  user: UserRound,
  play: Play,
  ae: Aperture,
  blender: Box,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = CATEGORY_ICONS[name as keyof typeof CATEGORY_ICONS] ?? Circle;
  return <Icon className={className} aria-hidden="true" />;
}
