import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout";
import { LessonView } from "@/components/academy/course-detail/LessonView";
import { courseSlugs, getCourse, lessonMeta } from "@/components/academy/course-detail/data";

export const dynamicParams = false;
export const generateStaticParams = () => courseSlugs.flatMap(slug => getCourse(slug)!.lessons.map(lesson => ({ slug, lesson: lesson.slug })));

export function generateMetadata({ params }: { params: { slug: string; lesson: string } }): Metadata {
  const course = getCourse(params.slug);
  const lesson = course?.lessons.find(l => l.slug === params.lesson);
  return course && lesson ? { title: `${lessonMeta(course.slug, lesson).title} | ${course.title} | Higgsfield`, description: course.description } : {};
}

export default function LessonPage({ params }: { params: { slug: string; lesson: string } }) {
  const course = getCourse(params.slug);
  const lesson = course?.lessons.find(l => l.slug === params.lesson);
  if (!course || !lesson) notFound();
  return <><Header /><LessonView course={course} lesson={lesson} /></>;
}
