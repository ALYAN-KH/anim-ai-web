export type GenjutsuVariant = {
  label: string;
  poster: string;
  video: string;
};

export type GenjutsuExample = {
  mode: "Object Swap" | "Motion Control";
  variants: GenjutsuVariant[];
  initialVariant?: number;
};

const mediaRoot = "https://static.higgsfield.ai/genjutus-fixes";

function example(
  folder: "showcases/v2" | "usecases",
  number: number,
  versions: number[],
  mode: GenjutsuExample["mode"],
  initialVariant = 0,
): GenjutsuExample {
  return {
    mode,
    initialVariant,
    variants: versions.map((version, index) => {
      const url = `${mediaRoot}/${folder}/item-${number}-${version}v`;
      return {
        label: index === 0 ? "Original" : `V${index}`,
        poster: `${url}-poster.webp`,
        video: `${url}.mp4`,
      };
    }),
  };
}

// Official public media from the Higgsfield Genjutsu landing page.
export const genjutsuExamples: GenjutsuExample[] = [
  example("usecases", 1, [1, 2, 3, 4], "Object Swap"),
  example("showcases/v2", 1, [2, 3, 4], "Motion Control"),
  example("showcases/v2", 2, [1, 2], "Object Swap"),
  example("usecases", 2, [1, 2, 3], "Motion Control"),
  example("showcases/v2", 3, [1, 2], "Object Swap"),
  example("showcases/v2", 4, [1, 2, 3], "Motion Control"),
  example("usecases", 3, [1, 2, 3], "Object Swap"),
  example("showcases/v2", 5, [1, 2], "Motion Control"),
  example("showcases/v2", 6, [1, 2], "Object Swap"),
  example("showcases/v2", 7, [1, 2], "Motion Control"),
  example("showcases/v2", 8, [1, 2], "Object Swap"),
  example("showcases/v2", 9, [1, 2], "Motion Control"),
  example("usecases", 1, [2, 3, 4], "Object Swap", 1),
  example("showcases/v2", 4, [1, 2, 3], "Motion Control", 1),
  example("usecases", 3, [1, 2, 3], "Object Swap", 1),
];
