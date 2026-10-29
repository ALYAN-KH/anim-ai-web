"use client";

import { Blend, Compass, Folder, Gamepad2, Plus, Trophy, UserRound, Users } from "lucide-react";
import { HiggsSnake } from "@/components/ui/HiggsSnake";
import { ReferenceIcon } from "./ReferenceIcon";
import styles from "./mobile-explore.module.css";

export function Sidebar({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
  const links = [
    { label: "Create", href: "/ai/image?model=soul-v2", icon: Plus },
    { label: "Explore", href: "/", icon: Compass },
    { label: "MCP", href: "/mcp", badge: "Connect", icon: null },
    { label: "Higgsfield Genjutsu", href: "/ai/video?model=genjutsu", badge: "FREE", icon: Blend },
    { label: "AI Influencer", href: "/ai-influencer-studio", icon: UserRound },
    { label: "Playable", href: "/playable", badge: "NEW!", icon: Gamepad2 },
    { label: "Community", href: "/community", icon: Users },
    { label: "Contests", href: "/contests/higgsfield-global-film-festival", icon: Trophy },
    { label: "Assets", href: "/gallery/all", icon: Folder },
  ];

  return <div className={styles.sidebarLayer}>
    <button className={styles.sidebarScrim} aria-label="Close menu" onClick={onClose} />
    <aside id="mobile-explore-sidebar" className={styles.sidebar} aria-label="Explore menu">
      <div className={styles.sidebarBrand}>
        <a href="/" aria-label="Higgsfield"><HiggsSnake /><span>Higgsfield</span></a>
        <button type="button" aria-label="Close sidebar" onClick={onClose}><ReferenceIcon name="menu" /></button>
      </div>
      <nav className={styles.sidebarNav}>
        {links.map(({ label, href, icon: Icon, ...item }, i) => <a href={href} key={label} className={i === 0 ? styles.createLink : ""} onClick={event => {
          if (label === "Explore") { event.preventDefault(); onClose(); }
          if (label === "Assets") { event.preventDefault(); onLogin(); }
        }}>
          {Icon ? <Icon aria-hidden="true" /> : <ReferenceIcon name="mcp" />}
          <span>{label}</span>
          {"badge" in item && <small className={item.badge === "NEW!" ? styles.newBadge : styles.navBadge}>{item.badge}</small>}
        </a>)}
      </nav>
      <div className={styles.sidebarFooter}>
        <strong>Bring your ideas to life</strong>
        <p>Sign in to create, save your work, and access it anytime</p>
        <button type="button" onClick={onLogin}>Log in</button>
      </div>
    </aside>
  </div>;
}
