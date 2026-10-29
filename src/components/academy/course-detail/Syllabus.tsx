"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import icons from "../course-detail-icons.json";
import { currentLesson, lessonCount, lessonHref, lessonMeta, type CourseLesson } from "./data";

/* Geometry and timing below are taken from the reference syllabus module (detail-module-readable.js). */
const HEIGHT = 310;
const WIDE = "M.05 .74 C .2 .62 .27 .7 .36 .56 S .55 .66 .68 .62 S .82 .68 .86 .46 S .9 .24 .95 .2";
const NARROW = "M.06 .42 C .28 .26 .42 .56 .6 .42 S .86 .24 .94 .14";
const scalePath = (width: number) => {
  let n = 0;
  return (width < 560 ? NARROW : WIDE).replace(/[MLCSQT]|-?\d*\.?\d+/g, token => /[A-Z]/.test(token) ? (n = 0, token) : (Number(token) * (n++ % 2 === 0 ? width : HEIGHT)).toFixed(1));
};
const leg = (a: Point, b: Point, from: number, to: number) => {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
  return d <= from + to ? "" : `M${a.x + dx * from / d} ${a.y + dy * from / d}L${b.x - dx * to / d} ${b.y - dy * to / d}`;
};
type Point = { x: number; y: number };
const Icon = ({ html }: { html: string }) => <span aria-hidden="true" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />;
const spring = "cubic-bezier(.3, 1.35, .4, 1)";

export function Syllabus({ courseSlug, lessons, certificateReady = false }: { courseSlug: string; lessons: CourseLesson[]; certificateReady?: boolean }) {
  const count = lessonCount(courseSlug, lessons);
  const current = currentLesson(lessons);
  const currentIndex = current ? lessons.findIndex(l => l.id === current.id) : lessons.length;
  return <section id="course-syllabus" className="flex min-w-0 scroll-mt-16 flex-col gap-q-400 p-q-100">
    <div className="flex items-center justify-between gap-q-400">
      <h2 className="text-q-accent-xs-bold uppercase tracking-[-0.04em] text-q-transparent-light-80">Syllabus</h2>
      <span className="text-q-body-md-medium text-q-text-brand">{count} {count === 1 ? "lesson" : "lessons"}</span>
    </div>
    {lessons.length
      ? <Trail courseSlug={courseSlug} lessons={lessons} currentIndex={currentIndex} certificateReady={certificateReady} />
      : <p className="text-q-body-sm-regular text-q-text-secondary">Lessons are coming soon.</p>}
  </section>;
}

function Trail({ courseSlug, lessons, currentIndex, certificateReady }: { courseSlug: string; lessons: CourseLesson[]; currentIndex: number; certificateReady: boolean }) {
  const router = useRouter();
  const maskId = useId();
  const root = useRef<HTMLDivElement>(null);
  const guide = useRef<SVGPathElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [width, setWidth] = useState(980);
  const [points, setPoints] = useState<Point[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);
  const [shown, setShown] = useState(false);

  const total = lessons.length;
  const narrow = width < 560;
  const d = scalePath(width);
  const pts = points.slice(0, total + 1);
  const active = Math.min(hover ?? currentIndex, total);
  const lesson = lessons[active];
  const meta = lesson ? lessonMeta(courseSlug, lesson) : undefined;
  const blocked = lesson?.access?.allowed === false;
  const allDone = currentIndex === total;
  const finish = active === total;
  const animate = shown || reduced;
  const cardWidth = Math.min(width - 24, narrow ? 400 : 480);
  const here = pts[active];
  const left = Math.max(12, Math.min((here?.x ?? 0) - cardWidth / 2, width - cardWidth - 12));
  const near = pts.filter(p => p.x >= left - 20 && p.x <= left + cardWidth + 20);
  const above = Math.min(...near.map(p => p.y)) - 100 - 34;
  const below = Math.min(198, Math.max(...near.map(p => p.y)) + 26);
  const top = narrow ? 198 : Math.max(12, above >= 12 ? above : below);
  const target = finish ? (certificateReady ? null : lessonHref(courseSlug, lessons[0].slug)) : lessonHref(courseSlug, lesson.slug);
  const open = !blocked && (!finish || allDone) && target;

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const observer = new ResizeObserver(() => setWidth(node.clientWidth));
    setWidth(node.clientWidth);
    observer.observe(node);
    const view = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) { setShown(true); view.disconnect(); } }, { threshold: 0.25 });
    view.observe(node);
    return () => { observer.disconnect(); view.disconnect(); };
  }, []);
  useEffect(() => {
    const path = guide.current;
    if (!path || typeof path.getTotalLength !== "function") return;
    const length = path.getTotalLength();
    setPoints(Array.from({ length: total + 1 }, (_, i) => {
      const at = path.getPointAtLength(length * (i === total ? 1 : i * (0.86 / Math.max(1, total - 1))));
      return { x: at.x, y: at.y };
    }));
  }, [d, total]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const select = (index: number) => { clearTimeout(timer.current); setHover(index); };
  const release = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setHover(null), 500); };
  const cumulative = pts.reduce<number[]>((acc, p, i) => { acc.push(i ? acc[i - 1] + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y) : 0); return acc; }, []);
  const length = cumulative.at(-1) || 1;
  const done = (l: CourseLesson | undefined) => !!l?.completed && (!l.homework_required || l.homework_submitted);

  const cardLabel = finish ? "Finish" : active === currentIndex ? "You are here" : blocked ? "Locked" : lesson?.completed ? "Completed" : "Up next";
  const cardTitle = finish ? "Course complete" : meta?.title;
  const minutes = lesson?.reading_minutes ?? 0;
  const cardText = finish
    ? (allDone ? "Claim your certificate" : "Finish all lessons to reach the end")
    : `${meta?.number == null ? meta?.label : `${meta.label} of ${lessonCount(courseSlug, lessons)}`}${minutes > 0 ? `, ${minutes} min` : ""}`;

  return <div
    ref={root}
    className={`academy-syllabus-trail relative h-77.5 overflow-hidden rounded-q-400 border border-q-border-subtle bg-q-transparent-light-05${narrow ? " is-narrow" : ""}`}
    onPointerMove={e => {
      if (e.pointerType !== "mouse" || !(e.target instanceof Element) || e.target.closest("[data-trail-card]")) return;
      const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
      select(pts.reduce((best, p, i) => Math.abs(p.x - x) < Math.abs((pts[best]?.x ?? 0) - x) ? i : best, 0));
    }}
    onPointerLeave={() => { if (!root.current?.contains(document.activeElement)) release(); }}
    onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) release(); }}
  >
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className="absolute left-1/2 top-1/2 h-[61.1875rem] w-[42.875rem] max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-90 object-cover opacity-4" src="https://static.higgsfield.ai/academy/academy-topography.webp" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className="absolute -left-2 -top-7 max-w-none opacity-60" src="https://assets.higgsfield.ai/tanstack/assets/01bd19df-T1NCH7Rd158QGdB6.svg" />
      <span className="absolute left-4 top-4 whitespace-pre-line text-q-mono-xs-medium text-q-transparent-light-15">{"COORDINATES\n34.0522° N\n119.2423° W\n\n--------------\n\nELEV. 720 M"}</span>
      <span className="absolute bottom-4 right-4 text-q-mono-xs-medium text-q-transparent-light-15">40.849N 78.682E</span>
    </div>
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" viewBox={`0 0 ${width} ${HEIGHT}`}>
      <path ref={guide} d={d} fill="none" stroke="none" />
      {pts.length > 1 && <>
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={HEIGHT}>
            <path d={pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ")} fill="none" stroke="white" strokeWidth={50} pathLength={1} strokeDasharray="1 1" strokeDashoffset={animate ? 0 : 1} style={{ transition: reduced ? "none" : "stroke-dashoffset 1.9s cubic-bezier(.65,0,.35,1) .7s" }} />
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          {pts.slice(0, -1).map((p, i) => {
            const radius = (index: number) => index === currentIndex ? 25 : 14;
            return <path key={lessons[i].id} d={leg(p, pts[i + 1], radius(i), radius(i + 1))} className={`academy-trail-leg ${done(lessons[i]) ? "is-done" : "is-future"}${active > currentIndex && i >= currentIndex && i < active ? " is-preview" : ""}`} />;
          })}
        </g>
      </>}
    </svg>
    {pts.map((p, i) => {
      const item = lessons[i];
      const isFinish = i === total;
      const isCurrent = i === currentIndex;
      const lock = isFinish ? !allDone : item?.access?.allowed === false;
      const info = item ? lessonMeta(courseSlug, item) : undefined;
      const b = cumulative[i] / length;
      const eased = b < 0.5 ? Math.cbrt(b / 4) : 1 - Math.cbrt((1 - b) / 4);
      const delay = reduced ? 0 : 0.7 + 1.9 * eased;
      const next = pts[i + 1] ?? p;
      const angle = Math.atan2(next.y - p.y, next.x - p.x) * 180 / Math.PI + 135;
      return <button
        key={item?.id ?? "finish"} type="button"
        aria-label={isFinish ? "Course complete" : `${info?.label}: ${info?.title}`}
        aria-current={isCurrent ? "step" : undefined} aria-disabled={lock || undefined}
        className={`academy-trail-marker${done(item) ? " is-done" : ""}${isCurrent ? " is-current" : ""}${isFinish ? " is-finish" : ""}${active === i ? " is-active" : ""}`}
        style={{ left: p.x, top: p.y, opacity: animate ? 1 : 0, transform: animate ? "none" : "scale(.3)", transition: reduced ? "none" : `opacity .25s ${delay}s, transform .5s ${delay}s ${spring}, background .25s, box-shadow .25s` }}
        onFocus={() => select(i)}
        onClick={() => { select(i); if (!lock) { const to = isFinish ? (certificateReady ? null : lessonHref(courseSlug, lessons[0].slug)) : lessonHref(courseSlug, item.slug); if (to) router.push(to); } }}
      >
        <span className="academy-trail-reticle" style={{ inset: animate ? (active === i ? -5 : -8) : -20, opacity: animate ? 1 : 0, transition: reduced ? "none" : `inset .7s ${delay}s ${spring}, opacity .7s ${delay}s` }} />
        {isCurrent && !isFinish && <>
          <span className="academy-trail-halo" />
          <span aria-hidden="true" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: icons.marker.replace(/ style="[^"]*"/, ` style="transform: rotate(${angle.toFixed(2)}deg)"`) }} />
        </>}
        {isFinish && <Icon html={icons.finish} />}
        {lock && !isFinish && <Icon html={icons.lock} />}
      </button>;
    })}
    {here && <div
      data-trail-card="true"
      className="_card_xm95d_1 absolute left-0 top-0 flex items-center gap-q-300 p-q-300"
      style={{ width: cardWidth, minHeight: 100, opacity: animate ? 1 : 0, transform: `translate(${left}px, ${top}px)`, transition: reduced ? "none" : `opacity .4s ${animate ? 2.6 : 0}s, transform .5s cubic-bezier(.2,.9,.25,1)` }}
    >
      {!narrow && lesson && !finish && <span className="relative flex h-16.5 w-29.25 shrink-0 items-center justify-center overflow-hidden rounded-q-300 bg-q-background-secondary">
        {(lesson.thumbnail ?? lesson.video_poster) && /* eslint-disable-next-line @next/next/no-img-element */ <img alt="" loading="lazy" decoding="async" className="object-cover" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} src={(lesson.thumbnail ?? lesson.video_poster)!} />}
        <span className="absolute inset-0 bg-q-transparent-dark-50" />
        <span className="relative" style={{ display: "flex", width: 24, height: 24 }}><Icon html={blocked ? icons.lock.replace(/ class="[^"]*"/, "") : icons.play.replace(/ class="[^"]*"/, "")} /></span>
      </span>}
      <div key={active} className="min-w-0 flex-1">
        <span className="text-q-label-sm-medium text-q-text-brand">{cardLabel}</span>
        <p className="line-clamp-2 text-q-body-lg-medium text-q-text-primary">{cardTitle}</p>
        <p className="mt-q-050 text-q-label-sm-medium text-q-text-secondary">{cardText}</p>
      </div>
      {open
        ? <>
          <Link href={target as string} aria-label={finish ? "Open certificate" : `Open ${meta?.title}`} className="absolute inset-0 rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-q-border-focus" />
          <span aria-hidden="true" className="q-button q-button-brand-soft q-button-sm q-button-icon-only pointer-events-none shrink-0 rounded-full"><Icon html={icons.arrow} /></span>
        </>
        : <span aria-label="Locked" role="img" className="shrink-0 text-q-text-secondary" style={{ display: "flex", width: 20, height: 20 }}><Icon html={icons.lock.replace(/ class="[^"]*"/, "")} /></span>}
    </div>}
  </div>;
}
