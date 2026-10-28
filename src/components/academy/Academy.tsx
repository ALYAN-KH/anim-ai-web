import fs from "node:fs";
import path from "node:path";
import { AcademyBehavior } from "./AcademyBehavior";
import { academyStylesheets } from "./stylesheets";
import "./academy.css";
import mediaManifest from "./media-manifest.json";

/** Markup copied from the live /academy page (reveal animations resolved to their end state). */
const markup = Object.entries(mediaManifest).sort(([a], [b]) => b.length - a.length).reduce(
  (html, [remote, local]) => html.split(remote).join(local),
  fs.readFileSync(path.join(process.cwd(), "src/components/academy/academy-main.html"), "utf8")
    .replace(/https:\/\/higgsfield.ai\/cdn-cgi\/image\/[^/]+\//g, ""),
);

export function Academy() {
  return (
    <>
      {academyStylesheets.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <div data-theme="default-dark" className="bg-q-background-primary text-q-text-primary" style={{ background: "var(--hf-color-background-primary)" }} data-academy-root="" suppressHydrationWarning>
        <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: markup }} />
        <AcademyBehavior />
      </div>
    </>
  );
}
