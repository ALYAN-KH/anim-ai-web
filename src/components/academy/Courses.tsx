"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import catalog from "./courses-data.json";
import styles from "./courses.module.css";

type Course = (typeof catalog.courses)[number];
type Filters = { category: string[]; level: string[]; duration: string[] };
const groups = [
  { key: "category", title: "Course type", options: ["Movie making", "UGC & Social Content", "Automate & Agents"] },
  { key: "level", title: "Level", options: ["Beginner", "Intermediate", "Advanced"] },
  { key: "duration", title: "Average time to complete", options: ["Less than 30 minutes", "30–60 minutes", "1–2 hours", "2+ hours"] },
] as const;
const emptyFilters = (): Filters => ({ category: [], level: [], duration: [] });
const usePageLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const sorts = [
  ["popular", "Popular"], ["newest", "Newest"], ["oldest", "Oldest"], ["a-z", "A–Z"], ["z-a", "Z–A"],
] as const;
// Observed ordering from the live catalogue; ties retain its editorial order.
const chronology: Record<string, number[]> = {
  newest: [16, 14, 15, 4, 6, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 1, 0],
  oldest: [0, 1, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 4, 6, 14, 15, 16],
};
const durationGroup = (minutes: number) => minutes < 30 ? "Less than 30 minutes" : minutes < 60 ? "30–60 minutes" : minutes <= 120 ? "1–2 hours" : "2+ hours";

export function selectCourses(query: string, filters: Filters, sort: string): Course[] {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return catalog.courses.filter(course => {
    const haystack = `${course.title} ${course.description} ${course.badges.map(b => b.label).join(" ")}`.toLocaleLowerCase();
    return words.every(word => haystack.includes(word)) &&
      (!filters.category.length || filters.category.includes(course.badges[0].label)) &&
      (!filters.level.length || filters.level.includes(course.badges[1].label)) &&
      (!filters.duration.length || filters.duration.includes(durationGroup(course.minutes)));
  }).sort((a, b) => {
    if (sort === "a-z") return a.title.localeCompare(b.title);
    if (sort === "z-a") return b.title.localeCompare(a.title);
    if (chronology[sort]) return chronology[sort].indexOf(a.order) - chronology[sort].indexOf(b.order);
    return a.order - b.order;
  });
}

function OriginalIcon({ html, className = "" }: { html: string; className?: string }) {
  return <span aria-hidden="true" className={`${styles.icon} ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

function CourseSort({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const options = useRef<(HTMLButtonElement | null)[]>([]);
  const close = (restoreFocus = false) => { setOpen(false); if (restoreFocus) trigger.current?.focus({ preventScroll: true }); };
  const show = () => { setActive(Math.max(0, sorts.findIndex(option => option[0] === value))); setOpen(true); };
  useEffect(() => {
    if (!open) return;
    options.current[active]?.focus({ preventScroll: true });
  }, [open, active]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const pane = root.current?.closest<HTMLElement>("[data-academy-scroll-container]");
    const overflow = pane?.style.getPropertyValue("overflow-y") ?? "";
    const priority = pane?.style.getPropertyPriority("overflow-y") ?? "";
    // The reference select is modal: wheel gestures cannot move the list behind it.
    pane?.style.setProperty("overflow-y", "hidden", "important");
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      if (overflow) pane?.style.setProperty("overflow-y", overflow, priority); else pane?.style.removeProperty("overflow-y");
    };
  }, [open]);
  return <div ref={root} className={styles.sortWrap} onKeyDown={event => {
    if (event.key === "Escape") { event.preventDefault(); close(true); }
    if (event.key === "Tab") close();
    if (open && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      setActive(index => event.key === "Home" ? 0 : event.key === "End" ? sorts.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + sorts.length) % sorts.length);
    }
  }}>
    <button ref={trigger} type="button" role="combobox" aria-label="Sort courses" aria-haspopup="listbox" aria-controls="academy-sort-options" aria-expanded={open} className={styles.sort} onClick={() => open ? close() : show()} onKeyDown={event => {
      if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) { event.preventDefault(); event.stopPropagation(); show(); }
    }}>
      <OriginalIcon html={catalog.icons.sort} /><span>Sort by: <strong>{sorts.find(option => option[0] === value)?.[1]}</strong></span>
      <OriginalIcon html={catalog.icons.chevron} className={open ? styles.chevronOpen : ""} />
    </button>
    {open && <div className={styles.sortPopup}><div id="academy-sort-options" role="listbox" aria-label="Sort courses" className={styles.sortOptions}>
      {sorts.map(([id, label], index) => <button key={id} ref={element => { options.current[index] = element; }} type="button" role="option" aria-selected={id === value} tabIndex={active === index ? 0 : -1} data-highlighted={active === index || undefined} className={styles.sortOption} onPointerMove={() => setActive(index)} onClick={() => { onChange(id); close(true); }}>
        <span>{label}</span>{id === value && <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13.875 9.2 18 19 7" /></svg>}
      </button>)}
    </div></div>}
  </div>;
}

function CourseCard({ course }: { course: Course }) {
  const [expanded, setExpanded] = useState(false);
  const infoId = `course-information-${course.slug}`;
  return <article className={styles.course} data-course={course.slug}>
    <div className={styles.cardRow}>
      <Link href={`/academy/courses/${course.slug}`} className={styles.thumbnail} aria-label={course.title}>
        {/* Original responsive image sources are preserved from the supplied HTML. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={course.image.src} srcSet={course.image.srcset} sizes={course.image.sizes} alt={course.image.alt} loading={course.order < 2 ? "eager" : "lazy"} decoding="async" />
      </Link>
      <div className={styles.cardBody}>
        <div className={styles.titleRow}>
          <h3><Link href={`/academy/courses/${course.slug}`}>{course.title}</Link></h3>
          {course.certificate && <span className={styles.certificate} dangerouslySetInnerHTML={{ __html: course.certificate }} />}
        </div>
        <p>{course.description}</p>
        <ul className={styles.badges} aria-label="Course information">
          {course.badges.map((badge, index) => <li key={badge.label}>
            <OriginalIcon html={badge.svg} className={index === 1 ? styles.levelIcon : ""} /><span>{badge.label}</span>
          </li>)}
        </ul>
        <div className={styles.actions}>
          <Link href={`/academy/courses/${course.slug}`} className={styles.primary}>Start now for free</Link>
          <button type="button" className={styles.secondary} aria-expanded={expanded} aria-controls={infoId} onClick={() => setExpanded(value => !value)}>{expanded ? "Hide details" : "View details"}</button>
        </div>
      </div>
    </div>
    <section id={infoId} hidden={!expanded} className={styles.details} aria-label={`${course.title} details`}>
      <h4>Details</h4>
      <dl>
        {[["Price", "Free"], ["Time length", course.badges[3].label], ["Level", course.badges[1].label], ["Lessons", course.badges[2].label.replace(" modules", "")]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <Link href={`/academy/courses/${course.slug}`}>View course and syllabus →</Link>
    </section>
  </article>;
}

export function Courses() {
  const page = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);
  usePageLayoutEffect(() => {
    const element = page.current;
    if (!element) return;
    const html = document.documentElement, body = document.body;
    const previous = [html.style.overflow, body.style.overflow, html.style.height, body.style.height];
    html.style.overflow = "hidden"; body.style.overflow = "hidden";
    html.style.height = "100%"; body.style.height = "100dvh";
    const measure = () => element.style.setProperty("--academy-header-height", `${Math.max(0, element.getBoundingClientRect().top)}px`);
    measure();
    const observer = new ResizeObserver(measure);
    const header = document.querySelector("body header");
    if (header) observer.observe(header);
    window.addEventListener("resize", measure);
    const readSort = () => {
      const selected = new URLSearchParams(window.location.search).get("sort") ?? "popular";
      if (sorts.some(option => option[0] === selected)) setSort(selected);
    };
    readSort(); window.addEventListener("popstate", readSort);
    return () => {
      [html.style.overflow, body.style.overflow, html.style.height, body.style.height] = previous;
      observer.disconnect(); window.removeEventListener("resize", measure); window.removeEventListener("popstate", readSort);
    };
  }, []);
  const changeSort = (value: string) => {
    setSort(value);
    const url = new URL(window.location.href);
    if (value === "popular") url.searchParams.delete("sort"); else url.searchParams.set("sort", value);
    window.history.replaceState(window.history.state, "", url);
    page.current?.scrollTo({ top: 0, behavior: "instant" });
  };
  const courses = useMemo(() => selectCourses(query, filters, sort), [query, filters, sort]);
  const count = Object.values(filters).reduce((n, values) => n + values.length, 0);
  const reset = () => { setQuery(""); setFilters(emptyFilters()); };
  const toggle = (key: keyof Filters, value: string) => setFilters(current => ({ ...current, [key]: current[key].includes(value) ? current[key].filter(item => item !== value) : [...current[key], value] }));

  return <main ref={page} className={styles.page} data-academy-courses="true" data-academy-scroll-container="true">
    <div className={styles.container}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}><ol><li><Link href="/academy">Academy</Link></li><li><span aria-hidden="true">/</span><span aria-current="page">Explore courses</span></li></ol></nav>
      <header className={styles.intro}>
        <h1>Explore courses and tutorials</h1>
        <p>Browse our comprehensive library of AI courses and video tutorials. From visual effects to game development, find the perfect content to level up your skills.</p>
      </header>
      <div className={styles.layout}>
        <aside className={styles.filters} aria-label="Course filters">
          <div className={styles.filterHeading}>
            <button type="button" aria-expanded={filtersOpen} aria-controls="academy-course-filters" onClick={() => setFiltersOpen(value => !value)}><OriginalIcon html={catalog.icons.filter} />Filters{count > 0 && <span>({count})</span>}</button>
            {count > 0 && <button type="button" onClick={() => setFilters(emptyFilters())}>Clear</button>}
          </div>
          <div id="academy-course-filters" className={`${styles.filterGroups} ${filtersOpen ? styles.filtersOpen : ""}`}>
            {groups.map(group => <div key={group.key} className={styles.filterGroup}><fieldset>
              <legend>{group.title}</legend>
              {group.options.map(option => <label key={option}>
                <input type="checkbox" checked={filters[group.key].includes(option)} onChange={() => toggle(group.key, option)} /><span>{option}</span>
              </label>)}
            </fieldset></div>)}
          </div>
        </aside>
        <div className={styles.results}>
          <div className={styles.toolbar}>
            <label className={styles.search}><OriginalIcon html={catalog.icons.search} /><input type="search" aria-label="Search courses" placeholder="Search" value={query} onChange={event => setQuery(event.target.value)} /></label>
            <CourseSort value={sort} onChange={changeSort} />
          </div>
          <section className={styles.courseList} aria-label="Courses" aria-busy="false">
            <p role="status" className={styles.srOnly}>{courses.length} {courses.length === 1 ? "course" : "courses"} found</p>
            {courses.map(course => <CourseCard key={course.slug} course={course} />)}
            {!courses.length && <div className={styles.empty}><h2>No courses found</h2><button type="button" onClick={reset} className={styles.primary}>Clear search and filters</button></div>}
          </section>
        </div>
      </div>
    </div>
  </main>;
}
