"use client";

import {
  useRef,
  useState
} from "react";

export function DrawToEditDialog({
  defaultTab,
  onClose,
  onSignup,
}: {
  defaultTab: "video" | "edit";
  onClose: () => void;
  onSignup?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"video" | "edit">(defaultTab);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      role="dialog"
      aria-labelledby="draw-dialog-title"
      data-state="open"
      className="fixed inset-0 z-[1000] grid size-full place-items-center bg-black/60 outline-none"
      style={{ pointerEvents: "auto" }}
    >
      <h2 id="draw-dialog-title" className="sr-only">
        {activeTab === "edit" ? "Draw To Edit" : "Draw To Video"}
      </h2>

      <div
        aria-busy="false"
        aria-disabled="false"
        className="relative z-[200] grid h-full w-full grid-rows-[auto_1fr] gap-2 overflow-hidden bg-[#1c1d20] p-4 md:h-[min(55rem,calc(100vh-2rem))] md:w-[min(80rem,calc(100vw-2rem))] md:rounded-q-600 md:border md:border-white/10 md:bg-[#1c1d20] md:p-2 animate-slide-in-down cursor-default"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[45.5%] -z-10 hidden h-155 w-224 -translate-x-1/2 -translate-y-1/2 md:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255, 255, 255, 0.13) 1px, transparent 1.5px), radial-gradient(circle, rgba(255, 255, 255, 0.13) 1px, transparent 1.5px)",
            backgroundPosition: "0px 0px, 10.5px 21px",
            backgroundSize: "21px 42px",
            maskImage:
              "radial-gradient(farthest-side, black 0%, rgba(0, 0, 0, 0.72) 52%, transparent 100%)",
          }}
        />

        <div className="relative hidden h-12 items-center justify-center md:flex">
          <div dir="ltr" data-orientation="horizontal">
            <div
              role="tablist"
              aria-orientation="horizontal"
              aria-label="Drawing type"
              className="relative grid w-max grid-flow-col auto-cols-fr items-center gap-1.5 rounded-full p-1 ring-1 ring-inset ring-white/10"
              tabIndex={0}
              data-orientation="horizontal"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-1 left-1 rounded-full border border-white/10 bg-white/[.06] shadow-[inset_0_1px_3px_rgba(255,255,255,.06)] transition-[transform,width] duration-200 ease-out"
                style={{
                  transform:
                    activeTab === "edit"
                      ? "translateX(156px)"
                      : "translateX(0px)",
                  width: "150px",
                }}
              />

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "video"}
                data-state={activeTab === "video" ? "active" : "inactive"}
                onClick={() => setActiveTab("video")}
                tabIndex={activeTab === "video" ? 0 : -1}
                data-orientation="horizontal"
                data-radix-collection-item
                className={`relative flex h-10 items-center justify-center rounded-full px-3 text-sm font-medium outline-none transition-colors focus-visible:bg-white/[.06] focus-visible:text-white ${activeTab === "video"
                    ? "text-white"
                    : "text-white/50 hover:text-white/70"
                  }`}
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center transition-colors ${activeTab === "video" ? "text-lime" : ""
                    }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="size-5"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M2.746 13.5c8.172-8.078 11.542-11.22 13.521-9.114 2.814 2.993-11.639 12.076-7.64 14.382 3.331 1.92 8.708-8.556 10.916-5.869 1.302 1.583-3.276 5.092-2.057 6.838.836 1.198 2.627.057 3.76-.966"
                    />
                  </svg>
                </span>
                <span className="px-1.5 leading-4 whitespace-nowrap">
                  Draw to Video
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "edit"}
                data-state={activeTab === "edit" ? "active" : "inactive"}
                onClick={() => setActiveTab("edit")}
                tabIndex={activeTab === "edit" ? 0 : -1}
                data-orientation="horizontal"
                data-radix-collection-item
                className={`relative flex h-10 items-center justify-center rounded-full px-3 text-sm font-medium outline-none transition-colors focus-visible:bg-white/[.06] focus-visible:text-white ${activeTab === "edit"
                    ? "text-white"
                    : "text-white/50 hover:text-white/70"
                  }`}
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center transition-colors ${activeTab === "edit" ? "text-lime" : ""
                    }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="size-5"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M11.855 21.25c-1.032-.26-3.16-.908-5.45-3.222C2.58 14.161 1.6 8.88 4.219 6.233 6.369 4.06 10.55 4.185 14 6.5m3.5 3.5c2.977 3.473 3.86 6.797 1.575 8.644-1.71 1.383-3.876-.217-5.14-1.45M10.75 13.25h2.853a1 1 0 0 0 .708-.294l6.484-6.495a1 1 0 0 0 0-1.414l-1.838-1.84a1 1 0 0 0-1.415 0l-6.5 6.5a1 1 0 0 0-.292.707z"
                    />
                  </svg>
                </span>
                <span className="px-1.5 leading-4 whitespace-nowrap">
                  Draw to Edit
                </span>
              </button>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center p-1">
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="q-close q-close-md"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="q-icon q-icon-md"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  d="m6.25 6.25 11.5 11.5m0-11.5-11.5 11.5"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-full min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto py-4">
            <form className="flex w-full max-w-106.5 flex-col items-center gap-11">
              <div className="flex w-full flex-col items-center gap-4">
                <div className="relative w-full">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 hidden h-[93.19%] w-29 -translate-y-1/2 md:block -left-10.5"
                  >
                    <svg
                      viewBox="0 0 115 234.84"
                      fill="none"
                      preserveAspectRatio="none"
                      className="absolute inset-0 size-full animate-deck-sliver-in opacity-55 motion-reduce:animate-none"
                    >
                      <path
                        d="M0 10.4409C0 3.53501 6.58775 -1.46608 13.2395 0.390121L107.37 26.6577C111.88 27.9163 115 32.0257 115 36.7085V194.254C115 198.791 112.068 202.808 107.748 204.192L13.6171 234.335C6.88349 236.491 0 231.468 0 224.397V10.4409Z"
                        fill="url(#draw-edit-left-fill)"
                      />
                      <path
                        d="M0.43457 10.4407C0.434705 3.82266 6.74852 -0.969988 13.123 0.808855L107.253 27.0764C111.575 28.2826 114.565 32.2207 114.565 36.7083V194.254C114.565 198.602 111.756 202.452 107.615 203.778L13.4844 233.921C7.03151 235.987 0.434817 231.173 0.43457 224.398V10.4407Z"
                        stroke="white"
                        strokeOpacity="0.1"
                        strokeWidth="0.869565"
                      />
                      <defs>
                        <linearGradient
                          id="draw-edit-left-fill"
                          x1="0"
                          y1="117.696"
                          x2="60.6081"
                          y2="117.696"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="white" stopOpacity="0.05" />
                          <stop offset="1" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 hidden h-[93.19%] w-29 -translate-y-1/2 md:block -right-10.5 -scale-x-100"
                  >
                    <svg
                      viewBox="0 0 115 234.84"
                      fill="none"
                      preserveAspectRatio="none"
                      className="absolute inset-0 size-full animate-deck-sliver-in opacity-55 motion-reduce:animate-none"
                    >
                      <path
                        d="M0 10.4409C0 3.53501 6.58775 -1.46608 13.2395 0.390121L107.37 26.6577C111.88 27.9163 115 32.0257 115 36.7085V194.254C115 198.791 112.068 202.808 107.748 204.192L13.6171 234.335C6.88349 236.491 0 231.468 0 224.397V10.4409Z"
                        fill="url(#draw-edit-right-fill)"
                      />
                      <path
                        d="M0.43457 10.4407C0.434705 3.82266 6.74852 -0.969988 13.123 0.808855L107.253 27.0764C111.575 28.2826 114.565 32.2207 114.565 36.7083V194.254C114.565 198.602 111.756 202.452 107.615 203.778L13.4844 233.921C7.03151 235.987 0.434817 231.173 0.43457 224.398V10.4407Z"
                        stroke="white"
                        strokeOpacity="0.1"
                        strokeWidth="0.869565"
                      />
                      <defs>
                        <linearGradient
                          id="draw-edit-right-fill"
                          x1="0"
                          y1="117.696"
                          x2="60.6081"
                          y2="117.696"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="white" stopOpacity="0.05" />
                          <stop offset="1" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div
                    className={`relative aspect-[426/252] w-full overflow-hidden rounded-2xl border border-q-border-strong bg-[#0f1113] bg-cover bg-no-repeat ${activeTab === "video" ? "bg-bottom" : "bg-center"
                      }`}
                  >
                    {activeTab === "edit" ? (
                      <video
                        loop
                        playsInline
                        disablePictureInPicture
                        preload="none"
                        src="https://static.higgsfield.ai/draw/draw-to-edit-video.mp4"
                        className="object-cover size-full"
                        autoPlay
                        muted
                      >
                        Your browser does not support the video.
                      </video>
                    ) : (
                      <video
                        loop
                        playsInline
                        disablePictureInPicture
                        preload="none"
                        src="https://static.higgsfield.ai/draw/product-to-video.mp4"
                        className="object-cover size-full object-bottom"
                        autoPlay
                        muted
                      >
                        Your browser does not support the video.
                      </video>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-9">
                <div className="flex flex-col items-center gap-3 text-center">
                  <h1 className="font-grotesk text-[2rem] leading-10 font-bold tracking-[-0.04em] uppercase text-white [font-feature-settings:'ss04'_1]">
                    {activeTab === "edit" ? "Draw to Edit" : "Draw to Video"}
                  </h1>
                  <p className="max-w-100.5 text-base leading-6 tracking-normal text-font-secondary">
                    {activeTab === "edit"
                      ? "Sketch on the frame to remove, add, or replace"
                      : "From flat design to photoreal mockup - in seconds"}
                  </p>
                </div>
                <input
                  hidden
                  ref={uploadInputRef}
                  accept="image/jpeg,image/jpg,image/png"
                  type="file"
                />
                <div className="flex w-full justify-center gap-3">
                  {activeTab === "video" && (
                    <button
                      type="button"
                      className="inline-flex h-12 w-[calc(50%-0.375rem)] shrink-0 items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-white/[.08] px-5 text-base font-semibold leading-6 text-white transition hover:bg-white/[.12] active:scale-[0.98]"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M8.403 19.25H20.25a1 1 0 0 0 1-1V5.75a1 1 0 0 0-1-1H3.75a1 1 0 0 0-1 1V6m5.653 13.25h-.367a3.5 3.5 0 0 1-2.115-.707 7.96 7.96 0 0 1-3.171-6.364V6m5.653 13.25c-2.57 0-2.57-3.61-1.542-5.156l-1.1-1.105C3.832 11.055 2.75 8.735 2.75 6"
                        />
                      </svg>
                      <span>Create blank</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSignup?.();
                    }}
                    className="inline-flex h-12 w-[calc(50%-0.375rem)] shrink-0 items-center justify-center gap-2 rounded-[10px] bg-[#dffd2b] px-5 text-base font-semibold leading-6 text-black shadow-[inset_0_-3px_0_rgba(255,255,255,.55),0_8px_20px_rgba(209,254,23,.22)] transition hover:brightness-95 active:scale-[0.98]"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M12 5.25V12m0 0v6.75M12 12H5.25M12 12h6.75"
                      />
                    </svg>
                    <span>Upload media</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
