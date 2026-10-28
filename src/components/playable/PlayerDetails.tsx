"use client";

import { useState } from "react";
import { ChevronDown, Copy, Info, ListFilter, X } from "lucide-react";
import { buildClaudeUrl } from "@/components/mcp/lib/chatgpt-url";
import type { PlayableGame } from "./data";
import { Icon } from "./icons";
import styles from "./player.module.css";

export function PlayerDetails({ game, onClose, closeRef }: { game: PlayableGame; onClose: () => void; closeRef: React.RefObject<HTMLButtonElement> }) {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState(true);
  const [notice, setNotice] = useState("");
  const copy = async () => {
    if (!game.prompt) return;
    try {
      await navigator.clipboard.writeText(game.prompt);
      setNotice(game.promptComplete ? "Prompt copied" : "Available prompt excerpt copied");
    } catch { setNotice("Could not copy. Select the prompt text to copy it manually."); }
  };
  return <aside className={styles.panel}>
    <header className={styles.header}>
      <h2 id="playable-player-title">{game.title}</h2>
      <button ref={closeRef} onClick={onClose} aria-label="Close player" className={styles.close}><X size={20} /></button>
    </header>
    <div className={styles.panelScroll}>
      <section className={styles.metadata}>
        <div className={styles.sectionHeading}><span><ListFilter size={17} /> PROMPT</span><button onClick={copy} disabled={!game.prompt}><Copy size={14} /> Copy</button></div>
        <div className={styles.prompt}>
          <p className={!expanded ? styles.clamped : undefined}>{game.prompt || "The original prompt was not included in the supplied game metadata."}</p>
          {game.prompt && <button onClick={() => setExpanded(value => !value)} aria-expanded={expanded}>{expanded ? "See less" : "See all"}<ChevronDown size={15} style={{ transform: expanded ? "rotate(180deg)" : undefined }} /></button>}
          {expanded && game.prompt && !game.promptComplete && <small>Only this excerpt is available in the supplied screenshot.</small>}
        </div>
        <button className={styles.sectionHeading} onClick={() => setDetails(value => !value)} aria-expanded={details}><span><Info size={17} /> DETAILS</span><ChevronDown size={15} style={{ transform: details ? "rotate(180deg)" : undefined }} /></button>
        {details && <dl className={styles.details}>{[["Feature", "Higgsfield Playable"], ["Category", game.category], ["Game genre", game.category], ["Dimension", game.dimension || "Not supplied"]].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>}
      </section>
    </div>
    <footer className={styles.actions}>
      <p role="status" className={styles.notice}>{notice}</p>
      {game.promptComplete && game.prompt ? <a className={styles.claude} href={buildClaudeUrl(game.prompt)} target="_blank" rel="noopener noreferrer"><Icon name="claude" className="size-5 text-[#d97757]" />Recreate in Claude</a> : <button className={styles.claude} disabled title="The complete original prompt is required"><Icon name="claude" className="size-5 text-[#d97757]" />Recreate in Claude</button>}
      <button className={styles.copyPrompt} onClick={copy} disabled={!game.prompt}><Copy size={20} />Copy prompt</button>
    </footer>
  </aside>;
}
