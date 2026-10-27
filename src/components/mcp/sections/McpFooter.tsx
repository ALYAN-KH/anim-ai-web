import { FOOTER_LINKS } from "../config";

export function McpFooter() {
  return (
    <footer className="border-t border-white/5 px-4 py-8 sm:px-7">
      <div className="mx-auto flex max-w-[1720px] flex-col items-center justify-between gap-4 text-sm font-medium text-white/45 md:flex-row">
        <p>© 2026 Higgsfield, Inc. All rights reserved.</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
