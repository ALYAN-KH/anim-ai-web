import { icons } from "./data";
import styles from "./mobile-explore.module.css";

/** Original SVG paths from the supplied HTML, independent of the site's icon CSS. */
export function ReferenceIcon({ name, className = "" }: { name: keyof typeof icons; className?: string }) {
  return <span aria-hidden="true" className={`${styles.icon} ${className}`} dangerouslySetInnerHTML={{ __html: icons[name] }} />;
}
