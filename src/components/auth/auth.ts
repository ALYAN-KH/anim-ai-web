import { useEffect, useState } from "react";

export type AuthMode = "login" | "signup";
export type AuthProvider = "google" | "apple" | "microsoft";
export type AuthTag = { text: string; icon: "check" | "diamond" };
export type AuthSlide = {
  id: string;
  label: string;
  type: "video" | "image";
  src: string;
  poster?: string;
  title: string;
  description: string;
  tags: AuthTag[];
};

export const AUTH_SLIDE_MS = 6000;

export const AUTH_SLIDES: AuthSlide[] = [
  {
    id: "seedance-4k",
    label: "Seedance 4K",
    type: "video",
    src: "https://static.higgsfield.ai/auth/seedance.mp4",
    title: "SEEDANCE 4K",
    description: "The world's most capable video model at full 4K",
    tags: [{ text: "4K Resolution", icon: "diamond" }],
  },
  {
    id: "nano-banana-pro",
    label: "Nano Banana Pro",
    type: "image",
    src: "https://static.higgsfield.ai/quiz-v2/auth-1.webp",
    title: "NANO BANANA PRO 4K",
    description:
      "The best image model, for the best price in the industry, only on Higgsfield",
    tags: [{ text: "4K Resolution", icon: "diamond" }],
  },
  {
    id: "higgsfield-soul",
    label: "Higgsfield Soul",
    type: "image",
    src: "https://static.higgsfield.ai/quiz-v2/auth-3.png",
    title: "HIGGSFIELD SOUL",
    description: "PLACEHOLDER: replace with the real Soul slide text",
    tags: [],
  },
  {
    id: "cinematic-app",
    label: "Cinematic App",
    type: "video",
    src: "https://static.higgsfield.ai/quiz-v2/auth-5-mini.mp4",
    title: "CINEMA STUDIO",
    description: "Turn images into cinematic shots with motion and transitions",
    tags: [
      { text: "Cinematic Motion", icon: "check" },
      { text: "Film-grade Shots", icon: "check" },
    ],
  },
];

export const AUTH_COPY = {
  signup: {
    heading: "Welcome to Higgsfield",
    subheading: "Sign up and generate for free",
    switchPrompt: "Already have an account?",
    switchAction: "Log in",
  },
  login: {
    heading: "Welcome back",
    subheading: "Log in to keep creating",
    switchPrompt: "New to Higgsfield?",
    switchAction: "Sign up",
  },
  promo: "Sign up with work email & Get 50 credits",
  divider: "OR",
  emailLabel: "Work email",
  emailPlaceholder: "name@company.com",
  submit: "Continue",
  sso: {
    prefix: "SSO available on",
    linkText: "Scale and Enterprise",
    suffix: "plans",
    href: "/enterprise",
  },
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function useAuthActions() {
  return {
    async social(provider: AuthProvider, mode: AuthMode) {
      window.location.assign(`/${mode}?provider=${provider}`);
    },
    async email(email: string, mode: AuthMode) {
      window.location.assign(`/${mode}?email=${encodeURIComponent(email)}`);
    },
  };
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const f = () => setMatches(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [query]);
  return matches;
}


