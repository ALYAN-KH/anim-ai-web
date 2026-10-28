import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { Signup } from "@/components/auth/Signup";

export const metadata: Metadata = { title: "Sign up | Higgsfield" };

export default function SignupPage() {
  return (
    <>
      <Header />
      <Signup />
    </>
  );
}
