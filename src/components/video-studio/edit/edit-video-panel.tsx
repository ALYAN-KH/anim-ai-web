"use client";

import { useEffect, useState } from "react";
import { editTools, editVideoMedia, videoTabs, type VideoTab } from "../data";
import { SourceIcon } from "../shared/SourceIcon";
import { DepthMapPanel } from "./depth-map/depth-map-panel";
import { EditToolForm } from "./edit-video/edit-tool-form";
import { ExtendToolForm } from "./extend-video/extend-tool-form";
import { FpsBoostPanel } from "./fps-boost/fps-boost-panel";
import { ReframePanel } from "./reframe/reframe-panel";
import { RemoveBackgroundPanel } from "./remove-background/remove-background-panel";
import { SdrToHdrPanel } from "./sdr-to-hdr/sdr-to-hdr-panel";
import { UpscalePanel } from "./upscale/upscale-panel";

export interface EditVideoPanelProps {
  tab: VideoTab;
  onTabChange: (tab: VideoTab) => void;
  search?: string;
  onSignup?: () => void;
}

export function EditVideoPanel({
  tab,
  onTabChange,
  search = "",
  onSignup,
}: EditVideoPanelProps) {
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [selectedModels, setSelectedModels] = useState({
    edit: "seedance-2.5-edit",
    extend: "seedance-2.5-edit",
  });

  useEffect(() => {
    const syncTool = () => {
      const tool = new URLSearchParams(window.location.search).get("tool");
      if (tool === "extend") setSelectedTool("extend-video");
      else if (tool === "edit") setSelectedTool("edit-video");
      else if (tool === "reframe") setSelectedTool("reframe");
      else if (tool === "upscale") setSelectedTool("upscale");
      else if (tool === "remove-background")
        setSelectedTool("remove-background");
      else if (tool === "sdr-to-hdr") setSelectedTool("sdr-to-hdr");
      else if (tool === "fps-boost") setSelectedTool("fps-boost");
      else if (tool === "depth-map") setSelectedTool("depth-map");
      else setSelectedTool("");
    };
    syncTool();
    window.addEventListener("popstate", syncTool);
    return () => window.removeEventListener("popstate", syncTool);
  }, []);

  const chooseTool = (id: string) => {
    setSelectedTool(id);
    const url = new URL(window.location.href);
    if (id === "extend-video") url.searchParams.set("tool", "extend");
    else if (id === "edit-video") url.searchParams.set("tool", "edit");
    else if (id === "reframe") url.searchParams.set("tool", "reframe");
    else if (id === "upscale") url.searchParams.set("tool", "upscale");
    else if (id === "remove-background")
      url.searchParams.set("tool", "remove-background");
    else if (id === "sdr-to-hdr") url.searchParams.set("tool", "sdr-to-hdr");
    else if (id === "fps-boost") url.searchParams.set("tool", "fps-boost");
    else if (id === "depth-map") url.searchParams.set("tool", "depth-map");
    else url.searchParams.delete("tool");
    window.history.pushState(null, "", url);
  };

  const visibleTools = editTools.filter((tool) =>
    `${tool.title} ${tool.description}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <aside className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[.08] bg-[#0f1113]">
      <nav className="flex shrink-0 gap-3 overflow-x-auto px-4 pt-1 [scrollbar-width:none]">
        {videoTabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={`h-11 shrink-0 whitespace-nowrap border-b-2 text-[14px] font-medium transition ${tab === item.id
                ? "border-white text-white"
                : "border-transparent text-white/55 hover:text-white"
              }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {selectedTool === "edit-video" ? (
        <EditToolForm
          onChangeTool={() => chooseTool("")}
          onSignup={onSignup}
          selectedModelId={selectedModels.edit}
          onModelChange={(id) =>
            setSelectedModels((models) => ({ ...models, edit: id }))
          }
        />
      ) : selectedTool === "extend-video" ? (
        <ExtendToolForm
          onSignup={onSignup}
          onChangeTool={() => chooseTool("")}
          selectedModelId={selectedModels.extend}
          onModelChange={(id) =>
            setSelectedModels((models) => ({ ...models, extend: id }))
          }
        />
      ) : selectedTool === "reframe" ? (
        <ReframePanel
          onChangeTool={() => chooseTool("")}
          onGenerate={() => onSignup?.()}
        />
      ) : selectedTool === "upscale" ? (
        <UpscalePanel
          onChangeTool={() => chooseTool("")}
          onGenerate={() => onSignup?.()}
        />
      ) : selectedTool === "remove-background" ? (
        <RemoveBackgroundPanel
          onChangeTool={() => chooseTool("")}
          onGenerate={() => onSignup?.()}
        />
      ) : selectedTool === "sdr-to-hdr" ? (
        <SdrToHdrPanel
          onChangeTool={() => chooseTool("")}
          onGenerate={() => onSignup?.()}
        />
      ) : selectedTool === "fps-boost" ? (
        <FpsBoostPanel
          onChangeTool={() => chooseTool("")}
          onGenerate={() => onSignup?.()}
        />
      ) : selectedTool === "depth-map" ? (
        <DepthMapPanel
          onChangeTool={() => chooseTool("")}
          onGenerate={() => onSignup?.()}
        />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-3 px-2 pt-2">
          <figure className="group relative h-[130px] w-full shrink-0 select-none overflow-hidden rounded-xl">
            <video
              src={editVideoMedia.hero}
              poster={editVideoMedia.heroPoster}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              className="pointer-events-none absolute inset-0 size-full object-cover"
            >
              Your browser does not support the video.
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_0%,rgba(0,0,0,.5)_50%)]" />
            <figcaption className="absolute bottom-0 left-0 z-10 w-full pb-3 pl-3 pr-1.5">
              <h2 className="w-full truncate font-grotesk text-[18px] font-bold uppercase leading-tight text-lime">
                Editing tools
              </h2>
              <p className="text-xs text-white/80">
                Modify, restyle, change angles, transform
              </p>
            </figcaption>
          </figure>

          <ul className="edit-video-tools min-h-0 flex-1 overflow-y-auto overscroll-contain pb-12 max-lg:max-h-[400px]">
            {visibleTools.map(({ id, title, description, icon, ...rest }) => (
              <li
                key={title}
                className="relative after:absolute after:inset-x-0 after:bottom-0 after:ml-16 after:border-b after:border-white/[.05] last:after:hidden"
              >
                <button
                  type="button"
                  onClick={() => chooseTool(id)}
                  aria-pressed={selectedTool === id}
                  className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2.5 text-left transition hover:bg-white/[.05] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white/40"
                >
                  <span className="flex min-w-0 flex-1 items-center gap-3">
                    <SourceIcon
                      name={icon}
                      size={24}
                      strokeWidth={1.5}
                      className="shrink-0 text-white/50"
                    />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5 pl-1">
                      <strong className="truncate text-[14px] font-medium leading-5 text-white">
                        {title}
                      </strong>
                      <span className="truncate text-[12px] leading-4 text-white/50">
                        {description}
                      </span>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {"isNew" in rest && rest.isNew && (
                      <span className="-skew-x-12 rounded-sm bg-lime px-1.5 text-[10px] font-bold uppercase leading-4 text-black">
                        <span className="inline-block skew-x-12">NEW</span>
                      </span>
                    )}
                    <SourceIcon
                      name="chevron-right"
                      size={16}
                      strokeWidth={1.5}
                      className="text-white/50"
                    />
                  </span>
                </button>
              </li>
            ))}
            {visibleTools.length === 0 && (
              <li className="px-3 py-6 text-sm text-white/50">
                No matching tools
              </li>
            )}
          </ul>
        </div>
      )}
    </aside>
  );
}
