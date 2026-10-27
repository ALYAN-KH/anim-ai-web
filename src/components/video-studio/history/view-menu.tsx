"use client";

import { ViewCheckIcon, ViewGridIcon, ViewListIcon, ViewMasonryIcon } from "./view-icons";
import { CardSizeSlider } from "./card-size-slider";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import type { HistoryLayout, HistoryState } from "./history-state";
import { HistoryToggle, MENU_CLASS, ROW_CLASS, SELECTED_CLASS, menuPosition, useHistoryMenu } from "./menu-primitives";

const LAYOUTS = [{ id: "list", label: "List", Icon: ViewListIcon }, { id: "grid", label: "Grid", Icon: ViewGridIcon }, { id: "masonry", label: "Masonry", Icon: ViewMasonryIcon }] as const;

export function HistoryViewMenu({ anchor, trigger, state, onClose }: { anchor: DOMRect; trigger: RefObject<HTMLButtonElement>; state: HistoryState; onClose: () => void }) {
  const ref = useHistoryMenu(onClose, trigger);
  return createPortal(<div ref={ref} className={`fixed z-[150] ${MENU_CLASS}`} style={menuPosition(anchor, 188, 292)}>
    <div role="menu" aria-label="History view">
      <p className="px-2 py-2 text-xs text-white/50">Layout</p>
      {LAYOUTS.map(({ id, label, Icon }) => <button key={id} type="button" role="menuitemradio" aria-checked={state.layout === id} onClick={() => state.setLayout(id as HistoryLayout)} className={`${ROW_CLASS} ${state.layout === id ? SELECTED_CLASS : ""}`}><Icon className="size-5" />{label}{state.layout === id && <ViewCheckIcon className="ml-auto size-5 text-lime" />}</button>)}
      <div className="my-1 h-px bg-white/[.04]" />
      <button type="button" role="switch" aria-label="Split by date" aria-checked={state.splitByDate} onClick={() => state.setSplitByDate(value => !value)} className={`${ROW_CLASS} ${state.splitByDate ? SELECTED_CLASS : ""}`}>Split by date<HistoryToggle checked={state.splitByDate} /></button>
      <div className="my-1 h-px bg-white/[.04]" /><p className="px-2 py-2 text-xs text-white/50">Card size</p>
      <CardSizeSlider value={state.cardSize} onChange={state.setCardSize} />
    </div>
  </div>, document.body);
}
