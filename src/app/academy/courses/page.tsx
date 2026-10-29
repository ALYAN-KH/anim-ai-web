import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { Courses } from "@/components/academy/Courses";

export const metadata: Metadata = {
  title: "Courses | Academy | Higgsfield",
  description: "Browse our comprehensive library of AI courses and video tutorials. From visual effects to game development, find the perfect content to level up your skills.",
};

export default function CoursesPage() {
  return <><Header /><Courses /></>;
}
