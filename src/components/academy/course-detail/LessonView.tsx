import Link from "next/link";
import icons from "../course-detail-icons.json";
import { Breadcrumb, Creators, PaneShell } from "./CourseDetail";
import { CoursePlayer } from "./CoursePlayer";
import styles from "./course-detail.module.css";
import { lessonCount, lessonHref, lessonMeta, sortedLessons, type CourseDetailData, type CourseLesson } from "./data";

const lockIcon = icons.lock.replace(/ class="[^"]*"/, "");

export function LessonView({ course, lesson }: { course: CourseDetailData; lesson: CourseLesson }) {
  const lessons = sortedLessons(course);
  const index = lessons.findIndex(l => l.id === lesson.id);
  const prev = lessons[index - 1], next = lessons[index + 1];
  const meta = lessonMeta(course.slug, lesson);
  const locked = lesson.access?.allowed === false;
  const blocker = lessons.find(l => l.id === lesson.access?.blocking_lesson_id);
  const total = lessonCount(course.slug, lessons);
  return <PaneShell>
    <div className="mx-auto w-full max-w-360 px-q-400 pb-28 lg:px-q-300">
      <Breadcrumb items={[
        { label: "Academy", href: "/academy" }, { label: "Courses", href: "/academy/courses" },
        { label: course.title, href: `/academy/courses/${course.slug}` }, { label: meta.title },
      ]} />
      <div className="grid min-w-0 items-start gap-q-600 lg:gap-q-300 lg:grid-cols-[minmax(0,28fr)_minmax(0,11fr)]">
        <div className="min-w-0 lg:px-q-200">
          {locked || !lesson.video
            ? <div className={styles.lessonLocked}>
              <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: lockIcon }} />
              <h2 className="text-q-body-lg-medium text-q-text-primary">This lesson is locked</h2>
              <p className="max-w-120 text-q-body-md-regular text-q-text-secondary">
                {blocker ? <>Complete the homework in <Link className="text-q-text-brand" href={lessonHref(course.slug, blocker.slug)}>{lessonMeta(course.slug, blocker).title}</Link> to unlock it.</> : "Finish the earlier lessons to unlock it."}
              </p>
            </div>
            : <CoursePlayer key={lesson.id} src={lesson.video} poster={lesson.video_poster ?? lesson.thumbnail} title={meta.title} />}
          <div className="flex flex-col gap-q-500 pt-7">
            <div className="flex flex-col gap-q-200">
              <span className="text-q-label-sm-medium text-q-text-brand">{meta.number == null ? meta.label : `${meta.label} of ${total}`}</span>
              <h1 className="text-q-title-sm-semi-bold text-q-text-primary">{meta.title}</h1>
              <p className="text-q-body-md-regular text-q-text-secondary">{course.title}</p>
            </div>
            <Creators creators={course.displayCreators} />
            <div className="flex flex-wrap gap-q-300">
              {prev && <Link href={lessonHref(course.slug, prev.slug)} className="q-button q-button-secondary q-button-md">Previous: {lessonMeta(course.slug, prev).title}</Link>}
              {next && (next.access?.allowed === false
                ? <span aria-disabled="true" className="q-button q-button-secondary q-button-md" style={{ opacity: .5, cursor: "not-allowed" }}>Next: {lessonMeta(course.slug, next).title} (locked)</span>
                : <Link href={lessonHref(course.slug, next.slug)} className="q-button q-button-primary q-button-md">Next: {lessonMeta(course.slug, next).title}</Link>)}
            </div>
          </div>
        </div>
        <aside className="flex min-w-0 flex-col gap-q-500 lg:sticky lg:top-14 lg:col-start-2">
          <section className="rounded-q-500 bg-q-background-primary p-q-100">
            <h2 className="px-q-400 py-q-300 text-q-body-md-medium">Lessons</h2>
            <ol className={`${styles.lessonList} mt-q-100 flex flex-col text-q-body-sm-medium`}>
              {lessons.map(l => {
                const m = lessonMeta(course.slug, l);
                const lock = l.access?.allowed === false;
                const inner = <>
                  <span className="min-w-0 flex-1"><span className="block text-q-label-xs-medium text-q-text-tertiary">{m.label}</span><span className="block truncate text-q-text-primary">{m.title}</span></span>
                  {lock && <span aria-label="Locked" role="img" className="shrink-0 text-q-text-secondary" style={{ width: 16, height: 16 }} dangerouslySetInnerHTML={{ __html: lockIcon }} />}
                </>;
                return <li key={l.id}>{lock
                  ? <span className={styles.row} aria-disabled="true">{inner}</span>
                  : <Link href={lessonHref(course.slug, l.slug)} aria-current={l.id === lesson.id ? "page" : undefined}>{inner}</Link>}</li>;
              })}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  </PaneShell>;
}
