"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { AuthDialog, type AuthMode } from "@/components/auth";
import { destination, quickLinks, quickPoster, type Preset } from "./data";
import { ReferenceIcon } from "./ReferenceIcon";
import { News } from "./News";
import { Media } from "./Media";
import { Sidebar } from "./Sidebar";
import { Recreate } from "./Recreate";
import { PresetGrid } from "./PresetGrid";
import styles from "./mobile-explore.module.css";

/** The new mobile Explore shell is completely isolated from the desktop home. */
export function MobileExplore() {
  const shell = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState<Preset | null>(null);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fit = () => shell.current?.style.setProperty("--mobile-explore-height", `${window.visualViewport?.height ?? window.innerHeight}px`);
    fit();
    window.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("resize", fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("resize", fit);
    };
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (authMode) setAuthMode(null);
      else if (menu) setMenu(false);
      else if (selected) setSelected(null);
      else { setSearch(false); setQuery(""); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu, selected, authMode]);

  useEffect(() => {
    if (search) searchInput.current?.focus();
  }, [search]);

  const login = () => { setMenu(false); setAuthMode("login"); };

  return <div ref={shell} className={styles.root} data-mobile-explore="true">
    {selected ? <Recreate key={selected.id} preset={selected} onClose={() => setSelected(null)} onLogin={() => setAuthMode("signup")} /> : <>
      <nav className={styles.header} aria-label="Mobile Explore navigation">
        <button type="button" className={styles.menuButton} aria-label={search ? "Close search" : "Open menu"} aria-expanded={menu} aria-controls="mobile-explore-sidebar" onClick={() => search ? (setSearch(false), setQuery("")) : setMenu(true)}>{search ? <ChevronLeft /> : <ReferenceIcon name="menu" />}</button>
        <span>{search ? "Search" : "Explore"}</span>
        <a href="/pricing" className={styles.upgrade}><ReferenceIcon name="diamond" />Upgrade</a>
      </nav>
      <div className={styles.scrollPane}>
        {!search && <>
          <News />
          <ul className={styles.quickLinks}>
            {quickLinks.map(item => <li key={item.label}><a href={destination(item.href)} onClick={event => { if (item.label === "Assets") { event.preventDefault(); login(); } }}>
              <span className={`${styles.quickTile} ${item.label === "MCP" ? styles.mcpTile : ""}`}>
                <span className={styles.quickPreview}>{item.label === "MCP" ? <ReferenceIcon name="mcp" /> : <Media video={item.video} image={quickPoster(item.video, item.poster)} label={item.label} posterVisible />}</span>
              </span>
              <span>{item.label}</span>
            </a></li>)}
          </ul>
          <div className={styles.communityHeading}>
            <hgroup><p>Recreate with one tap<ReferenceIcon name="sparkles" /></p><h2>Community presets</h2></hgroup>
            <a href="/ai/video?model=genjutsu">View all<ReferenceIcon name="chevron" /></a>
          </div>
        </>}
        <PresetGrid onSelect={setSelected} query={query} />
      </div>
      <div className={styles.searchDock}>
        {search ? <div className={styles.searchField}><ReferenceIcon name="search" /><input ref={searchInput} aria-label="Search presets" placeholder="Search" value={query} onChange={event => setQuery(event.target.value)} /><button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X /></button></div> : <button type="button" aria-label="Search Higgsfield" onClick={() => setSearch(true)}><ReferenceIcon name="search" /><span>Search</span></button>}
      </div>
    </>}
    {menu && <Sidebar onClose={() => setMenu(false)} onLogin={login} />}
    {authMode && <AuthDialog mode={authMode} onModeChange={setAuthMode} onClose={() => setAuthMode(null)} />}
  </div>;
}
