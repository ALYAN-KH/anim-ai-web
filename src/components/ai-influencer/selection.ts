// Selection rules ported from the reference builder: tier visibility, per-section limits,
// slot exclusivity, conflict rules and the randomizer's weighting.
import {
  ANIMAL_SECTIONS, ANIMAL_TIERS, CHARACTER_SECTIONS, RULE_MESSAGES, SECTIONS,
  type CharacterOption, type CharacterSection, type SectionId, type Selection, type TierId,
} from "./data";

/** Declaration order of the reference config; chips and the randomizer follow it (the sidebar sorts differently). */
const HUMAN_ORDER: SectionId[] = [
  "gender", "ethnicity_origin_base", "age", "skin_tone", "height", "body_type", "proportions", "freak_head", "freak_neck",
  "eye_shape", "eye_color", "freak_face", "facial_hair", "hair", "hair_colour", "distinctive", "aesthetic", "accessory",
];

export function isAnimal(tier: TierId) {
  return (ANIMAL_TIERS as readonly string[]).includes(tier);
}

/** Sections (and their options) the sidebar shows for a tier. */
export function visibleSections(tier: TierId): CharacterSection[] {
  const animal = isAnimal(tier);
  return CHARACTER_SECTIONS.filter((s) => !animal || ANIMAL_SECTIONS.includes(s.id)).map((s) => ({
    ...s,
    options: s.options.filter((o) => (animal ? o.id !== "pr_centaur" : o.visibleIn.includes(tier))),
  }));
}

type Conflict = { groups: SectionId[]; message: string };

function conflicts(tier: TierId, sel: Selection): Conflict[] {
  if (isAnimal(tier)) return [];
  const body = sel.body_type?.[0];
  const out: Conflict[] = [];
  if (body === "body_heavy" && sel.height?.some((h) => h === "h_tall" || h === "h_very_tall"))
    out.push({ groups: ["body_type", "height"], message: RULE_MESSAGES.kfgdXQ });
  if (tier !== "normal" && body && ["body_heavy", "body_muscular", "body_ultra"].includes(body) &&
    sel.proportions?.some((p) => p === "pr_shortlegs" || p === "pr_longlimbs"))
    out.push({ groups: ["body_type", "proportions"], message: RULE_MESSAGES.tTsi1Q });
  return out;
}

/** Message explaining why picking this option is blocked, if it is. */
export function blockedReason(tier: TierId, sel: Selection, section: SectionId, optionId: string) {
  if (!["body_type", "height", "proportions"].includes(section) || sel[section]?.includes(optionId)) return undefined;
  const next = { ...sel, [section]: section === "proportions" ? [...(sel.proportions ?? []), optionId] : [optionId] };
  return conflicts(tier, next).find((c) => c.groups.includes(section))?.message;
}

function addOption(section: CharacterSection, current: string[], option: CharacterOption) {
  if (section.max === 1 || option.id === "acc_none") return [option.id];
  const kept = current.filter((id) => {
    if (section.id === "accessory" && id === "acc_none") return false;
    const other = section.options.find((o) => o.id === id);
    return !option.slot || other?.slot !== option.slot;
  });
  return kept.length >= section.max ? current : [...kept, option.id];
}

/** Moves the centaur body from proportions into build, where the builder expects it. */
function migrate(sel: Selection): Selection {
  return sel.proportions?.includes("pr_centaur")
    ? { ...sel, body_type: ["pr_centaur"], proportions: sel.proportions.filter((p) => p !== "pr_centaur") }
    : sel;
}

/** Drops options the tier cannot show and re-applies limits. */
export function normalize(sel: Selection, tier: TierId): Selection {
  const source = migrate(sel);
  const out: Selection = {};
  for (const section of visibleSections(tier)) {
    const ids = source[section.id] ?? [];
    let kept: string[] = [];
    for (const id of ids) {
      const option = section.options.find((o) => o.id === id);
      if (option && !kept.includes(id)) kept = addOption(section, kept, option);
    }
    if (kept.length) out[section.id] = kept;
  }
  return out;
}

/** Click behaviour: toggle off a picked option, otherwise add it within the section's limits. */
export function toggleOption(sel: Selection, tier: TierId, sectionId: SectionId, optionId: string): Selection {
  const section = visibleSections(tier).find((s) => s.id === sectionId);
  const option = section?.options.find((o) => o.id === optionId);
  if (!section || !option || blockedReason(tier, sel, sectionId, optionId)) return sel;
  const next = normalize(sel, tier);
  const current = next[sectionId] ?? [];
  const picked = current.includes(optionId) ? current.filter((id) => id !== optionId) : addOption(section, current, option);
  if (picked.length) next[sectionId] = picked;
  else delete next[sectionId];
  return next;
}

function pick<T>(list: T[], random: () => number) {
  return list[Math.floor(random() * list.length)];
}

/** Random character for the tier; keeps the user's gender like the reference shuffle. */
export function randomSelection(tier: TierId, gender?: string[], random: () => number = Math.random): Selection {
  const sel: Selection = gender?.length ? { gender } : {};
  const sections = new Map(visibleSections(tier).map((s) => [s.id, s]));
  for (const id of HUMAN_ORDER) {
    const section = sections.get(id);
    if (!section || sel[id]) continue;
    if (id === "gender") { sel.gender = [random() < 0.67 ? "male" : "female"]; continue; }
    let pool = section.options.filter((o) => !blockedReason(tier, sel, id, o.id));
    if (id === "aesthetic") {
      const r = random();
      pool = r < 2 / 5 ? pool.filter((o) => o.id === "suits") : r < 3 / 5 ? pool.filter((o) => o.id === "retro") : pool.filter((o) => o.id !== "suits" && o.id !== "retro");
    } else if (id === "body_type") {
      pool = pool.filter((o) => o.id !== "body_curvy" &&
        !(o.id === "pr_centaur" && sel.proportions?.includes("pr_egg")) &&
        !(o.id === "body_heavy" && sel.proportions?.includes("pr_waist")) &&
        (tier !== "normal" || o.id !== "body_ultra") &&
        !(o.id === "body_ultra" && sel.freak_neck?.includes("neck_long")) &&
        !(o.id === "body_heavy" && sel.height?.some((h) => h === "h_tall" || h === "h_very_tall")));
    } else if (id === "proportions") {
      pool = pool.filter((o) => (o.id !== "pr_egg" || !sel.body_type?.includes("pr_centaur")) && (o.id !== "pr_waist" || !sel.body_type?.includes("body_heavy")));
    } else if (id === "freak_neck") {
      pool = pool.filter((o) => o.id !== "neck_long" || (!sel.body_type?.includes("body_ultra") && !sel.freak_face?.includes("ff_teeth_11")));
    } else if (id === "freak_face") {
      pool = pool.filter((o) => o.id !== "ff_teeth_11" || !sel.freak_neck?.includes("neck_long"));
    } else if (id === "facial_hair" && !sel.gender?.some((g) => g === "male" || g === "trans_man")) {
      pool = pool.filter((o) => o.id === "fh_none");
    }
    let choice: CharacterOption | undefined;
    if (id === "hair") {
      const lampshade = pool.find((o) => o.id === "hs_lampshade");
      const r = random();
      const rest = pool.filter((o) => o !== lampshade);
      choice = lampshade && r < 0.2 ? lampshade : lampshade ? rest[Math.floor(((r - 0.2) / 0.8) * rest.length)] : pick(pool, random);
    } else choice = pick(pool, random);
    if (choice) sel[id] = [choice.id];
  }
  return sel;
}

const LABELS = new Map(SECTIONS.flatMap((s) => s.options.map((o) => [`${s.id}:${o.id}`, o.label] as const)));

export function optionLabel(section: SectionId, id: string) {
  return LABELS.get(`${section}:${id}`) ?? id;
}

/** Chip labels in config order, as the "Picked settings" footer lists them. */
export function pickedLabels(sel: Selection, tier: TierId) {
  const visible = new Set(visibleSections(tier).map((s) => s.id));
  return HUMAN_ORDER.filter((id) => visible.has(id)).flatMap((s) => (sel[s] ?? []).map((id) => ({ section: s, id, label: optionLabel(s, id) })));
}
