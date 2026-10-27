import Link from "next/link";
import { Check, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AuthMediaCarousel } from "./AuthMediaCarousel";
import {
  AUTH_COPY,
  EMAIL_RE,
  useAuthActions,
  useMediaQuery,
  type AuthMode,
  type AuthProvider,
} from "./auth";

function AuthBrandMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 80 80" aria-hidden="true">
      <rect width="80" height="80" rx="16" fill="#d1fe17" />
      <path
        d="M64.2786 39.6003L64.2323 39.0943C63.7939 34.2383 60.6336 25.102 51.8677 25.102C45.3627 25.102 40.4487 31.5229 36.112 37.1838C32.6515 41.7173 29.6533 45.6063 26.3542 45.6063C25.4773 45.5146 24.3472 45.0772 23.6555 44.0877C23.0326 43.1898 22.8712 42.0393 23.1939 40.6585C23.7011 38.4722 26.6081 36.447 29.6758 34.2838C31.3594 33.1333 33.09 31.9135 34.2895 30.7399C37.75 27.4031 39.5031 24.9866 39.5031 21.0976C39.5031 17.2087 37.3579 15.2751 35.5585 14.4465C31.9598 12.79 26.6775 13.7564 23.3096 16.6565C22.8024 17.117 22.2946 17.5537 21.833 17.968C18.442 20.9828 16.1586 23.0312 10.9219 21.4657V27.7712C17.8653 30.8322 23.7018 24.9866 25.9164 22.2943C27.6232 20.5223 29.4225 19.4866 30.7609 19.4866H30.8304C31.4302 19.5097 31.9374 19.7399 32.307 20.1542C32.9068 20.8449 33.1376 21.6504 33.0219 22.5476C32.7679 24.4351 30.8072 26.6437 27.2085 29.0602C22.9869 31.891 15.9284 36.6317 15.3743 42.5921C14.959 46.8729 17.1736 51.1531 20.6341 52.8096C28.7077 56.63 33.6216 50.0481 38.8345 43.0981C42.8253 37.736 46.6085 32.6504 51.8684 32.6504C56.5972 32.6504 58.3502 36.5624 58.3502 39.0251V39.5086L57.8887 39.6003C46.424 41.6256 40.1723 52.3498 40.1723 57.2976C40.1723 62.2454 44.3708 66.48 49.538 66.48C55.5821 66.48 63.0559 61.3251 64.2555 46.8267L64.3017 46.2977H69.0769V39.601H64.2786V39.6003ZM58.0269 47.0332C57.1044 55.709 52.652 59.7596 49.9533 59.7596C48.7306 59.7596 47.0238 58.7469 47.0238 56.8602C47.0238 54.7432 50.1841 48.3223 57.2889 46.4125L58.1194 46.2053L58.0269 47.0339V47.0332Z"
        fill="#131313"
      />
    </svg>
  );
}

const GiftIcon = () => (
  <svg
    className="size-5 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6.25 4.41667C6.25 3.08198 7.33198 2 8.66667 2C10.043 2 11.2603 2.68092 12 3.72427C12.7397 2.68092 13.957 2 15.3333 2C16.668 2 17.75 3.08198 17.75 4.41667C17.75 5.39677 17.4047 6.29622 16.8291 7H19.25C20.2165 7 21 7.7835 21 8.75V9.5C21 10.4665 20.2165 11.25 19.25 11.25H12.75V7H13.6667C15.0934 7 16.25 5.8434 16.25 4.41667C16.25 3.91041 15.8396 3.5 15.3333 3.5C13.9066 3.5 12.75 4.6566 12.75 6.08333V7H11.25V6.08333C11.25 4.6566 10.0934 3.5 8.66667 3.5C8.16041 3.5 7.75 3.91041 7.75 4.41667C7.75 5.8434 8.9066 7 10.3333 7H11.25V11.25H4.75C3.7835 11.25 3 10.4665 3 9.5V8.75C3 7.7835 3.7835 7 4.75 7H7.1709C6.5953 6.29622 6.25 5.39677 6.25 4.41667Z"
      fill="currentColor"
    />
    <path
      d="M12.75 12.75H20V19.25C20 20.2165 19.2165 21 18.25 21H12.75V12.75Z"
      fill="currentColor"
    />
    <path
      d="M11.25 12.75H4V19.25C4 20.2165 4.7835 21 5.75 21H11.25V12.75Z"
      fill="currentColor"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path
      d="M18.8 10.209C18.8 9.55898 18.7417 8.93398 18.6333 8.33398H10V11.8798H14.9333C14.7208 13.0257 14.075 13.9965 13.1042 14.6465V16.9465H16.0667C17.8 15.3507 18.8 13.0007 18.8 10.209Z"
      fill="#4285F4"
    />
    <path
      d="M10.0003 19.1672C12.4753 19.1672 14.5503 18.3464 16.0669 16.9464L13.1044 14.6464C12.2836 15.1964 11.2336 15.5214 10.0003 15.5214C7.61276 15.5214 5.59193 13.9089 4.87109 11.7422H1.80859V14.1172C3.31693 17.113 6.41693 19.1672 10.0003 19.1672Z"
      fill="#34A853"
    />
    <path
      d="M4.86953 11.7411C4.6862 11.1911 4.58203 10.6036 4.58203 9.99948C4.58203 9.39531 4.6862 8.80781 4.86953 8.25781V5.88281H1.80703C1.16536 7.16019 0.831466 8.56999 0.832032 9.99948C0.832032 11.4786 1.1862 12.8786 1.80703 14.1161L4.86953 11.7411Z"
      fill="#FBBC05"
    />
    <path
      d="M10.0003 4.47982C11.3461 4.47982 12.5544 4.94232 13.5044 5.85065L16.1336 3.22148C14.5461 1.74232 12.4711 0.833984 10.0003 0.833984C6.41693 0.833984 3.31693 2.88815 1.80859 5.88398L4.87109 8.25898C5.59193 6.09232 7.61276 4.47982 10.0003 4.47982Z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path
      d="M9.68745 6.01898C8.95745 6.01898 7.82745 5.18898 6.63745 5.21898C5.06745 5.23898 3.62745 6.12898 2.81745 7.53898C1.18745 10.369 2.39745 14.549 3.98745 16.849C4.76745 17.969 5.68745 19.229 6.90745 19.189C8.07745 19.139 8.51745 18.429 9.93745 18.429C11.3474 18.429 11.7474 19.189 12.9874 19.159C14.2474 19.139 15.0474 18.019 15.8174 16.889C16.7074 15.589 17.0774 14.329 17.0975 14.259C17.0675 14.249 14.6475 13.319 14.6175 10.519C14.5975 8.17898 16.5274 7.05898 16.6174 7.00898C15.5175 5.39898 13.8274 5.21898 13.2374 5.17898C11.6974 5.05898 10.4074 6.01898 9.68745 6.01898ZM12.2874 3.65898C12.9375 2.87898 13.3674 1.78898 13.2474 0.708984C12.3174 0.748984 11.1974 1.32898 10.5274 2.10898C9.92745 2.79898 9.40745 3.90898 9.54745 4.96898C10.5774 5.04898 11.6375 4.43898 12.2874 3.65898Z"
      fill="#fff"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path d="M8.55425 8.55288H0V0H8.55425V8.55288Z" fill="#F1511B" />
    <path
      d="M18.0003 8.55288H9.44531V0H17.9996V8.55288H18.0003Z"
      fill="#80CC28"
    />
    <path d="M8.55425 18.0001H0V9.44727H8.55425V18.0001Z" fill="#00ADEF" />
    <path
      d="M18.0003 18.0001H9.44531V9.44727H17.9996V18.0001H18.0003Z"
      fill="#FBBC09"
    />
  </svg>
);

const CloudIcon = () => (
  <svg
    className="size-[18px] shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M17.9948 11.002C17.9983 10.9184 18 10.8344 18 10.75C18 7.43629 15.3137 4.75 12 4.75C9.3716 4.75 7.13793 6.44009 6.32647 8.7928C3.74507 9.12339 1.75 11.3287 1.75 14C1.75 16.8995 4.10051 19.25 7 19.25H18.125C20.4032 19.25 22.25 17.4032 22.25 15.125C22.25 12.8468 20.4032 11 18.125 11C18.0814 11 18.038 11.0007 17.9948 11.002Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AUTH_PROVIDERS: {
  id: AuthProvider;
  label: string;
  Icon: () => ReactNode;
}[] = [
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
  { id: "apple", label: "Continue with Apple", Icon: AppleIcon },
  { id: "microsoft", label: "Continue with Microsoft", Icon: MicrosoftIcon },
];

type AuthDialogProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
};

export function AuthDialog({ mode, onModeChange, onClose }: AuthDialogProps) {
  const actions = useAuthActions();
  const isXl = useMediaQuery("(min-width: 1280px)");
  const dialogRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [agreeError, setAgreeError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";
  const copy = AUTH_COPY[mode];
  const emailValid = EMAIL_RE.test(email.trim());

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const els = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!els || !els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      const at = document.activeElement;
      if (e.shiftKey && (at === first || at === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && at === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [onClose]);

  async function run(fn: () => Promise<void> | void) {
    if (isSignup && !agree) {
      setAgreeError(true);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await fn();
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!emailValid || busy) return;
    run(() => actions.email(email.trim(), mode));
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        tabIndex={-1}
        className="relative flex h-dvh w-full overflow-hidden bg-[#141516] outline-none md:h-[700px] md:max-h-[calc(100dvh-3rem)] md:w-[560px] md:max-w-[calc(100vw-3rem)] md:rounded-3xl md:border md:border-[#2b2d2f] xl:h-[min(776px,calc(100dvh-4rem))] xl:w-[1120px] xl:max-w-[calc(100vw-4rem)]"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-2xl border border-white/5 bg-white/5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d1fe17] md:right-5 md:top-5 md:size-8"
        >
          <X aria-hidden="true" className="size-4 text-white" />
        </button>

        {isXl && (
          <div className="hidden min-h-0 w-1/2 p-3 xl:block">
            <AuthMediaCarousel />
          </div>
        )}

        <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-14 md:px-[88px] md:py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="my-auto w-full shrink-0 md:my-0">
            <div className="mb-6 flex w-full flex-col gap-3 text-center md:mb-10 md:gap-4">
              <span className="flex w-full justify-center">
                <AuthBrandMark />
              </span>
              <div className="flex flex-col gap-2 md:gap-3">
                <h1
                  id="auth-title"
                  className="text-balance text-[22px] font-semibold tracking-[-0.02em] text-white md:text-[32px] md:leading-10 md:tracking-normal"
                >
                  {copy.heading}
                </h1>
                <p className="text-xs leading-[18px] text-white/40 md:text-sm md:text-white/60">
                  {copy.subheading}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 md:gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d1fe17]/10 p-3 text-xs font-semibold leading-4 text-[#d1fe17] md:text-sm">
                  <GiftIcon />
                  <span>{AUTH_COPY.promo}</span>
                </div>

                {AUTH_PROVIDERS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    disabled={busy}
                    onClick={() => run(() => actions.social(id, mode))}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 text-sm font-semibold text-white transition hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d1fe17] disabled:opacity-60 md:h-[60px]"
                  >
                    <Icon />
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex w-full items-center justify-center">
                <span className="text-center text-xs leading-[18px] text-white/30">
                  {AUTH_COPY.divider}
                </span>
              </div>

              <form
                noValidate
                onSubmit={onSubmit}
                className="flex w-full flex-col gap-3 md:gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="auth-email" className="text-xs text-white/40">
                    {AUTH_COPY.emailLabel}
                  </label>
                  <input
                    id="auth-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={AUTH_COPY.emailPlaceholder}
                    className="h-[52px] w-full rounded-xl border border-white/10 bg-transparent px-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-white/40"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!emailValid || busy}
                  className="h-12 w-full rounded-xl bg-[#d1fe17] text-sm font-semibold text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40 disabled:hover:brightness-100"
                >
                  {busy ? "Please waitâ€¦" : AUTH_COPY.submit}
                </button>
              </form>

              {error && (
                <p
                  role="alert"
                  className="text-center text-xs leading-4 text-[#fe1678]"
                >
                  {error}
                </p>
              )}

              {isSignup && (
                <div className="flex flex-col gap-2">
                  <label className="flex w-full cursor-pointer items-center gap-3 max-md:rounded-xl max-md:border max-md:border-white/10 max-md:p-3">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => {
                        setAgree(e.target.checked);
                        if (e.target.checked) setAgreeError(false);
                      }}
                      className="peer sr-only"
                    />
                    <span className="flex size-[18px] shrink-0 items-center justify-center rounded-md border-[1.5px] border-white/20 transition peer-checked:border-[#d1fe17] peer-checked:bg-[#d1fe17] peer-focus-visible:ring-2 peer-focus-visible:ring-[#d1fe17] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#141516] [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                      <Check
                        aria-hidden="true"
                        className="size-3 text-black"
                        strokeWidth={3}
                      />
                    </span>
                    <span className="min-w-0 flex-1 text-left text-xs font-normal leading-4 text-white">
                      I agree to the{" "}
                      <Link
                        href="/terms-of-use-agreement"
                        target="_blank"
                        className="underline"
                      >
                        Terms of Use
                      </Link>
                      , acknowledge the{" "}
                      <Link
                        href="/privacy-policy"
                        target="_blank"
                        className="underline"
                      >
                        Privacy Policy
                      </Link>
                      , and confirm I&apos;m at least 18 years old.
                    </span>
                  </label>
                  <p
                    role={agreeError ? "alert" : undefined}
                    aria-hidden={!agreeError}
                    className={`text-xs leading-4 text-[#d1fe17] ${agreeError ? "" : "invisible"}`}
                  >
                    * Please agree to the Terms of Use to continue
                  </p>
                </div>
              )}

              <p className="text-center text-xs text-white/60 md:text-sm">
                {copy.switchPrompt}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setAgreeError(false);
                    onModeChange(isSignup ? "login" : "signup");
                  }}
                  className="font-semibold text-white underline underline-offset-2 hover:text-[#d1fe17]"
                >
                  {copy.switchAction}
                </button>
              </p>

              <div className="mt-2 flex items-center justify-center gap-1.5 md:border-t md:border-white/10 md:pt-4">
                <span className="hidden text-white/60 md:block">
                  <CloudIcon />
                </span>
                <p className="text-center text-xs leading-4 text-white/30 md:text-sm md:font-medium md:text-white/60">
                  {AUTH_COPY.sso.prefix}{" "}
                  <Link
                    href={AUTH_COPY.sso.href}
                    onClick={onClose}
                    className="underline hover:text-white"
                  >
                    {AUTH_COPY.sso.linkText}
                  </Link>{" "}
                  {AUTH_COPY.sso.suffix}
                </p>
              </div>
            </div>

            <div
              id="clerk-captcha-modal"
              className="mx-auto empty:hidden [&:not(:empty)]:mt-8"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}


