"use client";

import { presets, type Preset } from "./data";
import { Media } from "./Media";
import styles from "./mobile-explore.module.css";

export function PresetGrid({ onSelect, query = "" }: { onSelect: (preset: Preset) => void; query?: string }) {
  const matches = (item: Preset) => !query || `${item.mode} Genjutsu Lite video`.toLowerCase().includes(query.toLowerCase());
  const columns = [[0, 3, 5, 7], [1, 2, 4, 6]];
  return <div className={styles.presets} aria-label="Community presets">
    {columns.map((column, i) => <div className={styles.presetColumn} key={i}>
      {column.map(index => presets[index]).filter(matches).map(item => <button key={item.id} type="button" aria-label={`Open preset ${item.id + 1}`} className={styles.preset} style={{ aspectRatio: item.ratio }} onClick={() => onSelect(item)}>
        <Media video={item.video} image={item.poster} label={`Genjutsu example ${item.id + 1}`} />
      </button>)}
    </div>)}
    {query && !presets.some(matches) && <p className={styles.empty}>No presets found</p>}
  </div>;
}
