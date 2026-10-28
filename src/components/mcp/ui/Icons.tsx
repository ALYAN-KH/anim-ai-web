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
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[0.27em] bg-[#d1fe17] text-black ${className}`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[130%] shrink-0">
        <path
          fill="currentColor"
          d="m20.35 11.844-.016-.173c-.15-1.654-1.238-4.766-4.252-4.766-2.238 0-3.927 2.187-5.419 4.116-1.19 1.544-2.221 2.868-3.356 2.868-.301-.03-.69-.18-.928-.517-.214-.306-.27-.698-.159-1.168.175-.745 1.175-1.434 2.23-2.171.579-.392 1.174-.808 1.586-1.208 1.19-1.136 1.793-1.96 1.793-3.284 0-1.325-.737-1.984-1.356-2.266-1.238-.564-3.054-.235-4.213.753-.174.157-.349.306-.508.447C4.586 5.502 3.801 6.2 2 5.666v2.148c2.388 1.043 4.395-.948 5.157-1.866.587-.603 1.206-.956 1.666-.956h.024c.206.008.38.086.508.227q.307.355.245.816c-.087.643-.761 1.395-1.999 2.218-1.452.965-3.88 2.58-4.07 4.61-.143 1.458.619 2.916 1.81 3.48 2.776 1.302 4.466-.94 6.258-3.308 1.373-1.826 2.674-3.559 4.483-3.559 1.626 0 2.229 1.333 2.229 2.172v.164l-.159.032c-3.943.69-6.093 4.343-6.093 6.028 0 1.686 1.444 3.128 3.221 3.128 2.079 0 4.65-1.756 5.062-6.695l.016-.18H22v-2.281zm-2.15 2.532c-.317 2.955-1.849 4.335-2.777 4.335-.42 0-1.007-.345-1.007-.988 0-.721 1.087-2.908 3.53-3.559l.286-.07z"
        />
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
