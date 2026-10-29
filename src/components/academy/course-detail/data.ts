import raw from "../course-detail-data.json";

export type CourseLesson = {
  access: { allowed: boolean; reason: string | null; blocking_lesson_id: string | null };
  homework_required: boolean;
  homework_submitted: boolean;
  id: string;
  slug: string;
  title: string;
  position: number;
  completed: boolean;
  thumbnail: string | null;
  video: string | null;
  video_poster: string | null;
  reading_minutes: number | null;
};
export type CourseDetailData = {
  slug: string;
  title: string;
  description: string;
  has_certificate: boolean;
  has_creator_drop: boolean;
  certificate_unlocked: boolean;
  objectives: { title: string; description: string }[];
  preview_media: { url: string; kind: string; poster_url: string | null } | null;
  updated_at: string;
  lessons: CourseLesson[];
  detailRows: { label: string; value: string; svg: string }[];
  displayCreators: { name: string; image: string | null }[];
  syllabusCount: string;
  startHref: string;
};

const courses = raw as unknown as Record<string, CourseDetailData>;

export const courseSlugs = Object.keys(courses);
export const getCourse = (slug: string): CourseDetailData | undefined => courses[slug];
export const sortedLessons = (course: CourseDetailData) => [...course.lessons].sort((a, b) => a.position - b.position);

/** AI Creation numbers lessons from the one after its introduction (reference `mv`/`hv`). */
export function lessonMeta(courseSlug: string, lesson: CourseLesson) {
  const intro = courseSlug === "ai-creation" && lesson.slug === "introduction";
  const number = intro ? null : courseSlug === "ai-creation" ? lesson.position - 1 : lesson.position;
  return {
    number,
    label: intro ? "Introduction" : `Lesson ${number}`,
    title: intro ? "Welcome to AI Creation" : lesson.title,
  };
}
export const lessonCount = (courseSlug: string, lessons: CourseLesson[]) =>
  courseSlug === "ai-creation" ? Math.max(0, lessons.length - 1) : lessons.length;

/** First unlocked lesson that is not finished (reference `J`). */
export const currentLesson = (lessons: CourseLesson[]) =>
  lessons.find(l => l.access?.allowed !== false && (!l.completed || (l.homework_required && !l.homework_submitted)));

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${months[m - 1]} ${d}, ${y}`;
}
export const lessonHref = (courseSlug: string, lessonSlug: string) => `/academy/courses/${courseSlug}/${lessonSlug}`;
