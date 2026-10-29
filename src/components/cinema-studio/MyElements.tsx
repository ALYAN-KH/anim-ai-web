"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import "./cinema-studio.css";
import { Sidebar } from "./Sidebar";

type Kind = "character" | "location" | "prop";
type Status = "none" | "in-progress" | "needs-review" | "approved" | "rejected";
export interface CsElement { id: string; name: string; kind: Kind; status?: Status; project?: string; thumb?: string; createdAt: number; usedAt?: number }

const STORE = "cinema-studio:elements"; // elements saved by the studio; nothing is seeded
const TABS: { id: "all" | Kind; label: string; empty: string }[] = [
  { id: "all", label: "All", empty: "No elements yet" }, { id: "character", label: "Characters", empty: "No characters yet" },
  { id: "location", label: "Locations", empty: "No locations yet" }, { id: "prop", label: "Props", empty: "No props yet" },
];
const STATUSES: { id: "all" | Status; label: string; dot?: string }[] = [
  { id: "all", label: "All" }, { id: "none", label: "No status" }, { id: "in-progress", label: "In progress", dot: "#1d9bf0" },
  { id: "needs-review", label: "Needs review", dot: "#f97316" }, { id: "approved", label: "Approved", dot: "#d1fe17" }, { id: "rejected", label: "Rejected", dot: "#ef4444" },
];
const SORTS = [{ id: "created", label: "Last created" }, { id: "used", label: "Last used" }, { id: "first", label: "First created" }] as const;
const LAYOUTS = ["grid", "kanban", "table"] as const;
const GROUPS = [{ id: "none", label: "None" }, { id: "date", label: "Created date" }, { id: "name", label: "Name" }] as const;
const CARD_MIN = [150, 200, 260];
const IMG = "https://static.higgsfield.ai/public/reference-elements/";

const Svg = ({ children, cls = "size-4" }: { children: ReactNode; cls?: string }) => <svg className={cls} aria-hidden="true" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">{children}</svg>;
const S = { stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const AT = "M16.8684 19.8667C15.4543 20.7437 13.7863 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 13.9797 20.2662 16.0242 17.9715 15.8156C16.0837 15.644 14.7249 13.9258 14.993 12.0492L15.5226 8.40278M14.9375 12.4805C14.63 14.6681 12.8291 16.2235 10.9149 15.9544C9.00068 15.6854 7.69817 13.6939 8.00562 11.5063C8.31308 9.31862 10.1141 7.76327 12.0283 8.03229C13.9424 8.30131 15.245 10.2928 14.9375 12.4805Z";
const I = {
  search: <Svg><path d="M20 20L16.1265 16.1265M16.1265 16.1265C17.4385 14.8145 18.25 13.002 18.25 11C18.25 6.99594 15.0041 3.75 11 3.75C6.99594 3.75 3.75 6.99594 3.75 11C3.75 15.0041 6.99594 18.25 11 18.25C13.002 18.25 14.8145 17.4385 16.1265 16.1265Z" {...S} /></Svg>,
  filter: <Svg><path d="M2.75 4.75H21.25M8.75 19.25H15.25M5.75 12H18.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></Svg>,
  view: <Svg><path d="M3.75 5.35C3.75 4.78995 3.75 4.50992 3.85899 4.29601C3.95487 4.10785 4.10785 3.95487 4.29601 3.85899C4.50992 3.75 4.78995 3.75 5.35 3.75H10.25V8.25H3.75V5.35Z" {...S} /><path d="M13.75 15.75H20.25V18.65C20.25 19.2101 20.25 19.4901 20.141 19.704C20.0451 19.8922 19.8922 20.0451 19.704 20.141C19.4901 20.25 19.2101 20.25 18.65 20.25H13.75V15.75Z" {...S} /><path d="M3.75 11.75H10.25V20.25H5.35C4.78995 20.25 4.50992 20.25 4.29601 20.141C4.10785 20.0451 3.95487 19.8922 3.85899 19.704C3.75 19.4901 3.75 19.2101 3.75 18.65V11.75Z" {...S} /><path d="M13.75 3.75H18.65C19.2101 3.75 19.4901 3.75 19.704 3.85899C19.8922 3.95487 20.0451 4.10785 20.141 4.29601C20.25 4.50992 20.25 4.78995 20.25 5.35V12.25H13.75V3.75Z" {...S} /></Svg>,
  at: <Svg cls="size-6 text-white"><path d={AT} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></Svg>,
  atSm: <Svg cls="size-[18px] text-white"><path d={AT} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></Svg>,
  sparkle: <Svg cls="size-[18px] text-white"><path d="M8.25 16.25C8.25 16.6642 8.58579 17 9 17C9.41421 17 9.75 16.6642 9.75 16.25C9.75 13.8242 10.2859 12.2487 11.2673 11.2673C12.2487 10.2859 13.8242 9.75 16.25 9.75C16.6642 9.75 17 9.41421 17 9C17 8.58579 16.6642 8.25 16.25 8.25C13.8242 8.25 12.2487 7.71411 11.2673 6.73269C10.2859 5.75127 9.75 4.17581 9.75 1.75C9.75 1.33579 9.41421 1 9 1C8.58579 1 8.25 1.33579 8.25 1.75C8.25 4.17581 7.71411 5.75127 6.73269 6.73269C5.75127 7.71411 4.17581 8.25 1.75 8.25C1.33579 8.25 1 8.58579 1 9C1 9.41421 1.33579 9.75 1.75 9.75C4.17581 9.75 5.75127 10.2859 6.73269 11.2673C7.71411 12.2487 8.25 13.8242 8.25 16.25Z" fill="currentColor" /><path d="M16.75 22.25C16.75 22.6642 17.0858 23 17.5 23C17.9142 23 18.25 22.6642 18.25 22.25C18.25 20.6922 18.5949 19.7418 19.1684 19.1684C19.7418 18.5949 20.6922 18.25 22.25 18.25C22.6642 18.25 23 17.9142 23 17.5C23 17.0858 22.6642 16.75 22.25 16.75C20.6922 16.75 19.7418 16.4051 19.1684 15.8316C18.5949 15.2582 18.25 14.3078 18.25 12.75C18.25 12.3358 17.9142 12 17.5 12C17.0858 12 16.75 12.3358 16.75 12.75C16.75 14.3078 16.4051 15.2582 15.8316 15.8316C15.2582 16.4051 14.3078 16.75 12.75 16.75C12.3358 16.75 12 17.0858 12 17.5C12 17.9142 12.3358 18.25 12.75 18.25C14.3078 18.25 15.2582 18.5949 15.8316 19.1684C16.4051 19.7418 16.75 20.6922 16.75 22.25Z" fill="currentColor" /></Svg>,
  inbox: <Svg cls="size-[18px] text-white"><path d="M2 12.75H7.91991C8.23049 12.75 8.52343 12.8943 8.71272 13.1405L9.64978 14.3595C9.83907 14.6057 10.132 14.75 10.4426 14.75H13.5574C13.868 14.75 14.1609 14.6057 14.3502 14.3595L15.2873 13.1405C15.4766 12.8943 15.7695 12.75 16.0801 12.75H22M22.1399 12.5352L18.4288 5.29391C18.2576 4.96001 17.914 4.75 17.5388 4.75H6.46118C6.08599 4.75 5.74237 4.96001 5.57125 5.29391L1.86007 12.5352C1.78773 12.6764 1.75 12.8327 1.75 12.9913V18.25C1.75 18.8023 2.19772 19.25 2.75 19.25H21.25C21.8023 19.25 22.25 18.8023 22.25 18.25V12.9913C22.25 12.8327 22.2123 12.6764 22.1399 12.5352Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></Svg>,
  check: <Svg><path d="M5.5 12.5L10 17L18.5 7.5" {...S} /></Svg>,
  chevR: <Svg><path d="M9.5 5.75L15.75 12L9.5 18.25" {...S} /></Svg>,
  project: <Svg cls="size-5"><path d="M7.5 4.75h9M5.5 8.25h13M4.75 11.75h14.5a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1H4.75a1 1 0 0 1-1-1v-5.5a1 1 0 0 1 1-1Z" {...S} /></Svg>,
  clock: <Svg cls="size-5"><path d="M12 7.5V12l3 2M20.25 12A8.25 8.25 0 1 1 12 3.75" {...S} /></Svg>,
  dashed: <Svg cls="size-5"><circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1.2 3.2" strokeLinecap="round" /></Svg>,
  grid: <Svg cls="size-5"><path d="M4.75 4.75h5.5v5.5h-5.5zM13.75 4.75h5.5v5.5h-5.5zM4.75 13.75h5.5v5.5h-5.5zM13.75 13.75h5.5v5.5h-5.5z" {...S} /></Svg>,
  kanban: <Svg cls="size-5"><rect x="3.75" y="3.75" width="16.5" height="16.5" rx="2" {...S} /><path d="M12 3.75v16.5" {...S} /></Svg>,
  table: <Svg cls="size-5"><rect x="3.75" y="3.75" width="16.5" height="16.5" rx="2" {...S} /><path d="M3.75 9.25h16.5M9.25 9.25v11" {...S} /></Svg>,
  shrink: <Svg cls="size-5"><path d="M13.5 10.5L19.25 4.75M13.5 10.5V6.5M13.5 10.5h4M10.5 13.5l-5.75 5.75M10.5 13.5v4M10.5 13.5h-4" {...S} /></Svg>,
};

function useElements() {
  const [list, setList] = useState<CsElement[]>([]);
  useEffect(() => {
    try { const raw = JSON.parse(window.localStorage.getItem(STORE) ?? "[]"); if (Array.isArray(raw)) setList(raw); } catch { /* unreadable store: treat as empty */ }
  }, []);
  return list;
}

function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", down); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open, close]);
  return ref;
}

const Sep = () => <div role="separator" className="mx-1 my-1 h-px bg-white/[0.06]" />;
const Label = ({ children }: { children: ReactNode }) => <div className="px-3 pb-1 pt-2 text-[12px] font-medium text-[#8d8e93]">{children}</div>;
const MENU = "absolute right-0 top-full z-30 mt-1 w-60 rounded-2xl border border-white/[0.06] bg-[#1f2023] p-1 shadow-[0_16px_40px_rgba(0,0,0,.5)]";
function Row({ icon, children, on, onClick, trailing }: { icon?: ReactNode; children: ReactNode; on?: boolean; onClick: () => void; trailing?: ReactNode }) {
  return (
    <button type="button" role="menuitemradio" aria-checked={on} onClick={onClick} className={`flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 text-left text-[14px] font-medium text-white transition-colors hover:bg-white/[0.06] ${on ? "bg-white/[0.08]" : ""}`}>
      {icon && <span className="flex size-5 shrink-0 items-center justify-center text-white">{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing ?? (on && <span className="text-white">{I.check}</span>)}
    </button>
  );
}
const TRIGGER = "flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-[14px] font-medium transition-[color,background-color,scale] duration-150 active:scale-[.96]";

export function MyElements() {
  const all = useElements();
  const [tab, setTab] = useState<"all" | Kind>("all");
  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [menu, setMenu] = useState<null | "filter" | "view">(null);
  const [sub, setSub] = useState(false);
  const [project, setProject] = useState<string | null>(null);
  const [status, setStatus] = useState<"all" | Status>("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("created");
  const [layout, setLayout] = useState<(typeof LAYOUTS)[number]>("grid");
  const [group, setGroup] = useState<(typeof GROUPS)[number]["id"]>("none");
  const [size, setSize] = useState(1);
  const [note, setNote] = useState("");
  const closeMenu = () => { setMenu(null); setSub(false); };
  const fRef = useDismiss(menu === "filter", closeMenu);
  const vRef = useDismiss(menu === "view", closeMenu);
  const input = useRef<HTMLInputElement>(null);

  const projects = useMemo(() => Array.from(new Set(all.map((e) => e.project).filter(Boolean) as string[])), [all]);
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const l = all.filter((e) => (tab === "all" || e.kind === tab) && (!project || e.project === project) && (status === "all" || (e.status ?? "none") === status) && (!needle || e.name.toLowerCase().includes(needle)));
    const by = { created: (a: CsElement, b: CsElement) => b.createdAt - a.createdAt, used: (a: CsElement, b: CsElement) => (b.usedAt ?? 0) - (a.usedAt ?? 0), first: (a: CsElement, b: CsElement) => a.createdAt - b.createdAt }[sort];
    return [...l].sort(by);
  }, [all, tab, q, project, status, sort]);
  const groups = useMemo(() => {
    if (group === "none") return [{ key: "", items: shown }];
    const m = new Map<string, CsElement[]>();
    for (const e of shown) { const k = group === "name" ? (e.name[0] ?? "#").toUpperCase() : new Date(e.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); m.set(k, [...(m.get(k) ?? []), e]); }
    return Array.from(m, ([key, items]) => ({ key, items }));
  }, [shown, group]);

  const exportCsv = () => {
    if (!all.length) { setNote("No elements to export"); window.setTimeout(() => setNote(""), 2600); return; }
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [["id", "name", "type", "status", "project", "created"], ...all.map((e) => [e.id, e.name, e.kind, e.status ?? "none", e.project ?? "", new Date(e.createdAt).toISOString()])];
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "elements.csv" });
    a.click(); URL.revokeObjectURL(url);
  };

  const tabLabel = TABS.find((t) => t.id === tab)!;
  const card = (e: CsElement) => (
    <div key={e.id} className="flex min-w-0 flex-col gap-2">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-white/5 shadow-[inset_0_-0.298px_5.356px_rgba(185,185,185,0.35)]">
        {e.thumb
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={e.thumb} alt={e.name} loading="lazy" draggable={false} className="size-full object-cover" />
          : <span className="flex size-full items-center justify-center text-[28px] font-semibold text-white/40">{e.name[0]?.toUpperCase()}</span>}
      </div>
      <span className="truncate text-center text-[14px] font-medium text-white">{e.name}</span>
    </div>
  );
  const body = (items: CsElement[]) => layout === "grid"
    ? <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fill,minmax(${CARD_MIN[size]}px,1fr))` }}>{items.map(card)}</div>
    : (
      <table className="w-full text-left text-[14px]"><thead className="text-[12px] text-[#8d8e93]"><tr>{["Name", "Type", "Status", "Project", "Created"].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
        <tbody>{items.map((e) => (
          <tr key={e.id} className="border-t border-white/[0.06] text-white">
            <td className="px-3 py-2.5 font-medium">{e.name}</td><td className="px-3 capitalize text-[#8d8e93]">{e.kind}</td>
            <td className="px-3 text-[#8d8e93]">{STATUSES.find((s) => s.id === (e.status ?? "none"))?.label}</td><td className="px-3 text-[#8d8e93]">{e.project ?? "—"}</td>
            <td className="px-3 text-[#8d8e93]">{new Date(e.createdAt).toLocaleDateString()}</td>
          </tr>))}</tbody></table>
    );

  const filtered = all.length > 0;
  const empty = shown.length === 0;
  return (
    <div className="cs-scope cs-root fixed inset-0 flex gap-1 overflow-hidden p-1 max-md:p-0">
      <Sidebar />
      <section data-project-feed-card className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111214] px-3 pb-1 pt-1 text-white">
        <div className="flex h-11 shrink-0 items-center justify-between gap-2 px-0.5">
          <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-2 text-[14px] font-medium">
            <span className="min-w-0 truncate text-[#8d8e93]">My Elements</span><span className="shrink-0 text-[#8d8e93]">/</span><span aria-current="page" className="min-w-0 truncate text-white">{tabLabel.label}</span>
          </nav>
          <div className="flex items-center gap-2">
            {note && <span role="status" className="text-[12px] text-[#8d8e93]">{note}</span>}
            <button type="button" onClick={exportCsv} className="h-8 rounded-lg bg-white px-3.5 text-[14px] font-medium text-black transition-[filter,scale] duration-150 hover:brightness-95 active:scale-[.96]">Export CSV</button>
          </div>
        </div>
        <div className="shrink-0">
          <div className="flex h-12 items-center justify-between gap-2">
            <div role="tablist" className="flex items-center gap-1">
              {TABS.map((t) => (
                <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`h-8 cursor-pointer rounded-full px-3.5 text-[14px] font-medium transition-colors ${tab === t.id ? "bg-white/10 text-white" : "text-[#8d8e93] hover:text-white"}`}>{t.label}</button>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <div role="button" tabIndex={0} aria-label="Search" onClick={() => { setSearching(true); input.current?.focus(); }} onKeyDown={(e) => { if (e.key === "Enter" && !searching) { setSearching(true); input.current?.focus(); } }}
                className={`group/search relative flex h-8 shrink-0 cursor-pointer items-center gap-1.5 overflow-hidden rounded-lg border px-3 transition-[width,background-color,border-color,scale] duration-200 ease-out ${searching || q ? "w-[250px] border-white/10 bg-white/[0.04]" : "w-[101px] border-transparent hover:bg-white/5"}`}>
                <span className="flex size-4 shrink-0 items-center justify-center text-[#8d8e93] transition-colors group-hover/search:text-white">{I.search}</span>
                {!(searching || q) && <span aria-hidden className="whitespace-nowrap pr-1.5 text-[14px] font-medium text-[#8d8e93] group-hover/search:text-white">Search</span>}
                <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => !q && setSearching(false)} placeholder="Search" tabIndex={searching || q ? 0 : -1} className={`min-w-0 flex-1 bg-transparent text-[14px] font-medium text-white outline-none placeholder:text-[#8d8e93] ${searching || q ? "" : "pointer-events-none absolute inset-0 opacity-0"}`} />
              </div>
              <div ref={fRef} className="relative">
                <button type="button" aria-haspopup="menu" aria-expanded={menu === "filter"} onClick={() => { setMenu(menu === "filter" ? null : "filter"); setSub(false); }} className={`${TRIGGER} ${menu === "filter" ? "bg-white/10 text-white" : "text-[#8d8e93] hover:text-white"}`}>{I.filter}Filter</button>
                {menu === "filter" && (
                  <div role="menu" className={MENU}>
                    <div className="relative">
                      <Row icon={I.project} onClick={() => setSub((s) => !s)} on={sub} trailing={<span className="flex items-center text-[#8d8e93]">{project ? <span className="mr-1 max-w-20 truncate text-[12px]">{project}</span> : null}{I.chevR}</span>}>Project</Row>
                      {sub && (
                        <div role="menu" className="absolute right-full top-0 mr-1 w-52 rounded-2xl border border-white/[0.06] bg-[#1f2023] p-1 shadow-[0_16px_40px_rgba(0,0,0,.5)]">
                          {projects.length === 0 && <div className="px-3 py-2 text-[14px] text-[#8d8e93]">No projects</div>}
                          {projects.length > 0 && <Row on={project === null} onClick={() => setProject(null)}>All projects</Row>}
                          {projects.map((p) => <Row key={p} on={project === p} onClick={() => setProject(p)}>{p}</Row>)}
                        </div>
                      )}
                    </div>
                    <Sep /><Label>Status</Label>
                    {STATUSES.map((s) => (
                      <Row key={s.id} on={status === s.id} onClick={() => setStatus(s.id)}
                        icon={s.dot ? <span className="size-2.5 rounded-full" style={{ background: s.dot }} /> : s.id === "all" ? I.clock : I.dashed}>{s.label}</Row>
                    ))}
                    <Sep /><Label>Sort by</Label>
                    {SORTS.map((s) => <Row key={s.id} on={sort === s.id} onClick={() => setSort(s.id)}>{s.label}</Row>)}
                  </div>
                )}
              </div>
              <div ref={vRef} className="relative">
                <button type="button" aria-haspopup="menu" aria-expanded={menu === "view"} onClick={() => { setMenu(menu === "view" ? null : "view"); setSub(false); }} className={`${TRIGGER} ${menu === "view" ? "bg-white/10 text-white" : "text-[#8d8e93] hover:text-white"}`}>{I.view}View</button>
                {menu === "view" && (
                  <div role="menu" className={MENU}>
                    <Label>Layout</Label>
                    {([["grid", "Grid", I.grid], ["kanban", "Kanban", I.kanban], ["table", "Table", I.table]] as const).map(([id, label, icon]) => <Row key={id} icon={icon} on={layout === id} onClick={() => setLayout(id)}>{label}</Row>)}
                    <Sep /><Label>Group by</Label>
                    {GROUPS.map((g) => <Row key={g.id} on={group === g.id} onClick={() => setGroup(g.id)}>{g.label}</Row>)}
                    <Sep /><Label>Card size</Label>
                    <div className="flex items-center gap-2 px-2 pb-2">
                      <button type="button" aria-label="Smallest cards" onClick={() => setSize(0)} className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-white/[0.08] text-white transition-colors hover:bg-white/[0.12]">{I.shrink}</button>
                      <div role="slider" aria-label="Card size" aria-valuemin={0} aria-valuemax={2} aria-valuenow={size} tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "ArrowRight") setSize((s) => Math.min(2, s + 1)); if (e.key === "ArrowLeft") setSize((s) => Math.max(0, s - 1)); }}
                        className="relative flex h-9 min-w-0 flex-1 overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03]">
                        {[0, 1, 2].map((k) => (
                          <button key={k} type="button" aria-label={["Small", "Medium", "Large"][k]} onClick={() => setSize(k)} className="relative flex-1 cursor-pointer">
                            {k < 2 && <span className="absolute right-0 top-3 h-3 w-px bg-white/30" />}
                            {k === size && <span className="absolute inset-y-1 left-1 right-1 rounded-md bg-white/15" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="my-1 h-px shrink-0 bg-white/[0.06]" />
        </div>

        <div className="hide-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto">
          {empty ? (
            <div className="flex w-full flex-1 flex-col items-center justify-center gap-8 p-8">
              <div className="flex flex-col items-center gap-4">
                <span className="flex items-center justify-center rounded-full border border-[rgba(197,197,197,0.3)] bg-white/5 p-4 shadow-[inset_0_-0.298px_5.356px_rgba(185,185,185,0.35),0_20.533px_20.533px_rgba(0,0,0,0.09)]">{I.at}</span>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-center text-[16px] font-semibold text-white">{filtered ? "No elements found" : tabLabel.empty}</p>
                  <p className="text-center text-[14px] text-[#8d8e93]">{filtered ? "Try a different search or filter" : "Create element to use it consistently across all projects"}</p>
                </div>
              </div>
              {!filtered && (
                <div className="grid w-[640px] max-w-full shrink-0 grid-cols-3 gap-0.5">
                  {([["Create element", I.atSm, "empty-1", "rounded-l-2xl"], ["Add to prompt-box", I.sparkle, "empty-2", ""], ["Use for consistency", I.inbox, "empty-3", "rounded-r-2xl"]] as const).map(([label, icon, img, r]) => (
                    <div key={img} className={`flex h-[252px] flex-col gap-3 overflow-hidden bg-white/5 p-3 ${r}`}>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-[rgba(197,197,197,0.3)] bg-white/5 shadow-[inset_0_-0.298px_5.356px_rgba(185,185,185,0.35),0_5.059px_11.308px_rgba(0,0,0,0.10),0_20.533px_20.533px_rgba(0,0,0,0.09)]">{icon}</span>
                        <p className="min-w-0 truncate text-[14px] text-white">{label}</p>
                      </div>
                      <div aria-hidden className="pointer-events-none flex min-h-0 flex-1 select-none items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="" width={188} height={188} loading="lazy" decoding="async" draggable={false} src={`${IMG}${img}.webp`} className="size-[188px] max-w-full object-contain" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : layout === "kanban" ? (
            <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto p-3">
              {STATUSES.filter((s) => s.id !== "all").map((s) => {
                const col = shown.filter((e) => (e.status ?? "none") === s.id);
                return (
                  <div key={s.id} className="flex w-[240px] shrink-0 flex-col gap-3 rounded-2xl bg-white/5 p-3">
                    <div className="flex items-center gap-2 text-[14px] font-medium text-white">{s.dot && <span className="size-2.5 rounded-full" style={{ background: s.dot }} />}{s.label}<span className="text-[#8d8e93]">{col.length}</span></div>
                    {col.map(card)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-5 p-3">
              {groups.map((g) => <div key={g.key} className="flex flex-col gap-3">{g.key && <h3 className="text-[12px] font-medium text-[#8d8e93]">{g.key}</h3>}{body(g.items)}</div>)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
