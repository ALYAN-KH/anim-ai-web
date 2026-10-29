import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import icons from "../course-detail-icons.json";
import { AcademyPane } from "./AcademyPane";
import { CoursePlayer } from "./CoursePlayer";
import { CourseRewards } from "./CourseRewards";
import { ReviewPrompt } from "./ReviewPrompt";
import { StartCourseButton } from "./StartCourseButton";
import { Syllabus } from "./Syllabus";
import { formatDate, sortedLessons, type CourseDetailData } from "./data";

const rewardsHtml = fs.readFileSync(path.join(process.cwd(), "src/components/academy/course-rewards.html"), "utf8");
const stylesheet = "/academy/course-detail-reference.css";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return <nav aria-label="Breadcrumb" className="flex h-14 min-h-14 items-center overflow-hidden lg:px-q-150">
    <ol className="flex min-w-0 items-center gap-q-200 px-q-150 text-q-body-sm-medium">
      {items.map((item, index) => <li key={item.label} className="flex min-w-0 items-center gap-q-200">
        {index > 0 && <span aria-hidden="true" className="shrink-0 text-q-text-secondary">/</span>}
        <span className="min-w-0 truncate">
          {item.href
            ? <Link href={item.href} className="block truncate transition-colors hover:text-q-text-primary focus-visible:rounded-q-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-q-border-focus motion-reduce:transition-none text-q-text-secondary">{item.label}</Link>
            : <span aria-current="page" className="text-q-text-primary">{item.label}</span>}
        </span>
      </li>)}
    </ol>
  </nav>;
}

export function PaneShell({ children }: { children: React.ReactNode }) {
  return <>
    <link rel="stylesheet" href={stylesheet} />
    <AcademyPane>{children}</AcademyPane>
  </>;
}

export function Creators({ creators }: { creators: CourseDetailData["displayCreators"] }) {
  return <div className="flex flex-wrap gap-q-500">
    {creators.map(creator => <div key={creator.name} className="flex items-center gap-q-300">
      {creator.image
        ? <div className="relative size-9 shrink-0 overflow-hidden rounded-full">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={creator.image} alt="" width={36} height={36} loading="lazy" decoding="async" className="object-cover size-full" /></div>
        : <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-q-brand-primary text-q-text-inverse" dangerouslySetInnerHTML={{ __html: icons.studio }} />}
      <div className="flex flex-col gap-q-100">
        <span className="text-q-label-xs-medium text-q-text-tertiary">Created by</span>
        <span className="text-q-label-sm-medium text-q-text-primary">{creator.name}</span>
      </div>
    </div>)}
  </div>;
}

export function CourseDetail({ course }: { course: CourseDetailData }) {
  const lessons = sortedLessons(course);
  const learn = course.objectives.filter(o => o.title);
  const rewards = course.has_certificate || course.has_creator_drop;
  const media = course.preview_media;
  return <PaneShell>
    <div className="mx-auto w-full max-w-360 px-q-400 pb-28 lg:px-q-300">
      <Breadcrumb items={[{ label: "Academy", href: "/academy" }, { label: course.title }]} />
      <div className="grid min-w-0 items-start gap-q-600 lg:gap-q-300 lg:grid-cols-[minmax(0,28fr)_minmax(0,11fr)]">
        <div className="min-w-0 lg:px-q-200">
          <section className="min-w-0">
            {media
              ? <CoursePlayer src={media.url} poster={media.poster_url} title={course.title} />
              : <div className="aspect-video w-full rounded-q-600 bg-q-background-secondary" />}
            <div className="flex flex-col gap-q-500 pt-7">
              <div className="flex flex-col gap-q-300">
                <h1 className="text-q-title-sm-semi-bold text-q-text-primary">{course.title}</h1>
                <p className="max-w-200 whitespace-pre-line text-q-body-md-regular text-q-text-secondary">{course.description}</p>
              </div>
              <Creators creators={course.displayCreators} />
            </div>
          </section>
        </div>
        <aside className="flex min-w-0 flex-col gap-q-500 lg:sticky lg:top-14 lg:col-start-2 lg:row-span-2">
          <section className="rounded-q-500 bg-q-background-primary p-q-100">
            <h2 className="px-q-400 py-q-300 text-q-body-md-medium">Details</h2>
            <dl className="mt-q-100 rounded-q-400 border border-q-border-subtle bg-q-transparent-light-05 px-q-400 py-q-100 text-q-body-sm-medium">
              {course.detailRows.map(row => <div key={row.label} className="flex items-center gap-q-200 border-b border-q-border-default py-q-300 last:border-0">
                <dt className="flex min-w-0 items-center gap-q-200 text-q-text-secondary [&>svg]:size-5 [&>svg]:shrink-0">
                  <span aria-hidden="true" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: row.svg }} />{row.label}
                </dt>
                <dd className="ml-auto text-right text-q-text-primary">{row.label === "Price" ? <span className="text-q-text-brand">{row.value}</span> : row.value}</dd>
              </div>)}
            </dl>
          </section>
          {course.has_certificate && <section className="rounded-q-500 bg-q-background-primary p-q-100">
            <div className="flex justify-between gap-q-300 px-q-400 py-q-300 text-q-body-md-medium"><h2>Certificate</h2><span className="text-q-text-brand">Yes · free</span></div>
            <div className="mt-q-100 flex min-h-54.5 items-center justify-center rounded-q-400 border border-q-border-subtle bg-q-transparent-light-05 p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Course certificate" width={231} height={154} loading="lazy" decoding="async" className="object-cover aspect-3/2 w-57.75 max-w-full rounded-q-300 object-contain shadow-lg" src="https://static.higgsfield.ai/academy/certification.webp" />
            </div>
          </section>}
          {lessons.length > 0 && <StartCourseButton />}
          <div className="flex flex-col items-center gap-q-300 text-center text-q-caption-sm-medium text-q-text-secondary">
            <ReviewPrompt />
            <p>Last updated {formatDate(course.updated_at)}</p>
          </div>
        </aside>
        <div className="flex min-w-0 flex-col gap-12 pt-q-600 lg:col-start-1 lg:px-q-200">
          {rewards && <CourseRewards html={rewardsHtml} />}
          <Syllabus courseSlug={course.slug} lessons={lessons} certificateReady={course.certificate_unlocked} />
          {learn.length > 0 && <section className="flex flex-col gap-q-400">
            <h2 className="text-q-accent-xs-bold uppercase tracking-[-0.04em] text-q-transparent-light-80">What you’ll learn</h2>
            <ul className="grid gap-q-200 sm:grid-cols-2">
              {learn.map(item => <li key={item.title} className="flex items-center gap-q-300 rounded-q-400 bg-q-transparent-light-05 p-q-400">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img width={24} height={24} alt="" className="shrink-0" src={icons.check} />
                <span className="text-q-body-md-regular text-q-transparent-light-80">{item.title}</span>
              </li>)}
            </ul>
          </section>}
        </div>
      </div>
    </div>
  </PaneShell>;
}
