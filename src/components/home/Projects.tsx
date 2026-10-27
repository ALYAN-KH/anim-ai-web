import { GalleryAction } from "@/components/gallery/GalleryAction";
import { ProjectCard } from "./ProjectCard";
import data from "@/data/content";

export function Projects() {
  const meta = data.projectsMeta;

  return (
    <section className="mx-3 my-10 md:my-12" aria-labelledby="projects-title">
      <h2 id="projects-title" className="ttl">
        {meta.title}
      </h2>
      <p className="mb-5 mt-1 text-xs text-zinc-400 md:text-sm">{meta.sub}</p>

      <div className="relative max-h-[540px] overflow-hidden max-sm:max-h-[470px] sm:max-h-[520px] md:max-h-[560px] lg:max-h-[570px]">
        <div className="fade-mask grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {data.projects.map((project) => (
            <ProjectCard
              key={project.href}
              title={project.t}
              by={project.by}
              href={project.href}
              poster={project.poster}
              avatar={project.avatar}
              video={project.video}
              hue={120}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-7 z-30 flex justify-center max-sm:bottom-4">
          <GalleryAction
            href={meta.href}
            label={meta.cta}
            className="pointer-events-auto"
          />
        </div>
      </div>
    </section>
  );
}


