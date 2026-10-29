import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout";
import { CourseDetail } from "@/components/academy/course-detail/CourseDetail";
import { courseSlugs, getCourse } from "@/components/academy/course-detail/data";

export const dynamicParams = false;
export const generateStaticParams = () => courseSlugs.map(slug => ({ slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const course = getCourse(params.slug);
  return course ? { title: `${course.title} | Academy | Higgsfield`, description: course.description } : {};
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = getCourse(params.slug);
  if (!course) notFound();
  return <><Header /><CourseDetail course={course} /></>;
}
