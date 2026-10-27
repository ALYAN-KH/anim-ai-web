import CN from "country-flag-icons/react/3x2/CN";
import DE from "country-flag-icons/react/3x2/DE";
import ES from "country-flag-icons/react/3x2/ES";
import FR from "country-flag-icons/react/3x2/FR";
import IN from "country-flag-icons/react/3x2/IN";
import IT from "country-flag-icons/react/3x2/IT";
import JP from "country-flag-icons/react/3x2/JP";
import KR from "country-flag-icons/react/3x2/KR";
import NL from "country-flag-icons/react/3x2/NL";
import PK from "country-flag-icons/react/3x2/PK";
import PL from "country-flag-icons/react/3x2/PL";
import PT from "country-flag-icons/react/3x2/PT";
import RU from "country-flag-icons/react/3x2/RU";
import SA from "country-flag-icons/react/3x2/SA";
import TR from "country-flag-icons/react/3x2/TR";
import US from "country-flag-icons/react/3x2/US";

// Official 3:2 country flags, bundled locally so they never depend on a remote image host.
const FLAGS = {
  us: US, cn: CN, fr: FR, de: DE, in: IN, it: IT, jp: JP, kr: KR,
  pt: PT, ru: RU, es: ES, pk: PK, sa: SA, tr: TR, nl: NL, pl: PL,
};

export type FlagCode = keyof typeof FLAGS;

export function Flag({ code, className = "h-3 w-[18px]" }: { code: FlagCode; className?: string }) {
  const Svg = FLAGS[code];
  return (
    <Svg
      aria-hidden="true"
      className={`shrink-0 overflow-hidden rounded-[2px] ${className}`}
    />
  );
}
