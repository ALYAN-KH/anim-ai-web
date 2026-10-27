"use client";

import { createElement } from "react";

/** Exact SVG element geometry extracted from the user-provided HTML. */
const SHAPES = {
  sparkles: [
    {
      tag: "path",
      attributes: {
        d: "M10.107 10.992c-.459.293-.607.609-.607.841 0 .233.148.548.607.842.45.289 1.117.492 1.893.492s1.443-.203 1.893-.492c.459-.294.607-.61.607-.842s-.148-.547-.607-.841c-.45-.289-1.117-.492-1.893-.492s-1.443.203-1.893.492m4.393 3.067c-.697.39-1.573.608-2.5.608s-1.803-.218-2.5-.608v4.024c0 .233.148.548.607.842.45.289 1.117.492 1.893.492s1.443-.203 1.893-.492c.459-.294.607-.61.607-.842zm1.5-2.226c0-.918-.58-1.644-1.297-2.104C13.977 9.263 13.019 9 12 9c-1.02 0-1.977.263-2.703.729C8.58 10.189 8 10.915 8 11.833V22.25a.75.75 0 0 0 1.5 0v-1.94c.697.389 1.573.607 2.5.607s1.803-.218 2.5-.608v1.941a.75.75 0 0 0 1.5 0z",
        fill: "currentColor",
        fillRule: "evenodd",
        clipRule: "evenodd",
        stroke: "none",
      },
    },
    {
      tag: "path",
      attributes: {
        d: "M4.642 5.216a.4.4 0 0 1 .716 0c.754 1.508.917 1.67 2.425 2.424a.4.4 0 0 1 0 .715c-1.508.754-1.671.916-2.425 2.424a.4.4 0 0 1-.716 0c-.754-1.508-.917-1.67-2.425-2.424a.4.4 0 0 1 0-.715c1.508-.753 1.671-.916 2.425-2.424M11.639 1.22a.4.4 0 0 1 .715 0c.754 1.509.917 1.671 2.425 2.425a.4.4 0 0 1 0 .715c-1.508.753-1.671.916-2.425 2.424a.4.4 0 0 1-.715 0c-.755-1.508-.917-1.67-2.426-2.424a.4.4 0 0 1 0-.715c1.509-.754 1.671-.916 2.426-2.424M18.635 5.216a.4.4 0 0 1 .715 0c.754 1.508.917 1.67 2.425 2.424a.4.4 0 0 1 0 .715c-1.508.754-1.67.916-2.425 2.424a.4.4 0 0 1-.715 0c-.755-1.508-.917-1.67-2.426-2.424a.4.4 0 0 1 0-.715c1.509-.753 1.671-.916 2.426-2.424",
        fill: "currentColor",
        stroke: "none",
      },
    },
  ],
  "chevron-right": [
    {
      tag: "path",
      attributes: {
        d: "M9.5 18.25 15.75 12 9.5 5.75",
      },
    },
  ],
  film: [
    {
      tag: "path",
      attributes: {
        d: "M15.25 2.75V4.75M15.25 4.75V19.25M15.25 4.75H3.75C3.19772 4.75 2.75 5.19772 2.75 5.75V18.25C2.75 18.8023 3.19772 19.25 3.75 19.25H15.25M15.25 19.25V21.25M18.75 19.25H20.25C20.8023 19.25 21.25 18.8023 21.25 18.25V5.75C21.25 5.19772 20.8023 4.75 20.25 4.75H18.75M8.25 12H9M8.25 12V11.75M8.25 12V12.25M7.5 9.5V14.5L10.75 12L7.5 9.5Z",
      },
    },
  ],
  crop: [
    {
      tag: "path",
      attributes: {
        d: "M2.75 5.75H17.25C17.8023 5.75 18.25 6.19772 18.25 6.75V21.25M5.75 2.75V17.25C5.75 17.8023 6.19772 18.25 6.75 18.25H21.25",
      },
    },
  ],
  expand: [
    {
      tag: "path",
      attributes: {
        d: "M13.75 3.75h6.5v6.5m-16.5 3.5v6.5h6.5m9.227-15.727L13.75 10.25m-3.5 3.5-5.727 5.727",
      },
    },
  ],
  layers2: [
    {
      tag: "path",
      attributes: {
        d: "M19.25 3.75H4.75a1 1 0 0 0-1 1v14.5a1 1 0 0 0 1 1h14.5a1 1 0 0 0 1-1V4.75a1 1 0 0 0-1-1",
      },
    },
    {
      tag: "path",
      attributes: {
        d: "M8 4v4H4V4zM12 8v4H8V8zM8 12v4H4v-4zM12 16v4H8v-4z",
        fill: "currentColor",
        stroke: "none",
      },
    },
    {
      tag: "path",
      attributes: {
        d: "M12 1.75v20.5",
      },
    },
  ],
  "sun-moon": [
    {
      tag: "path",
      attributes: {
        d: "M13.598 6.5a6 6 0 1 1 0 11M11 22.25v-1.5m0-17.5v-1.5M3.752 19.248l1.06-1.06m0-12.375-1.06-1.06M.75 12h1.5m8.553-3A6 6 0 0 0 10 12c0 1.227.368 2.368 1 3.318M17 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z",
      },
    },
  ],
  gauge: [
    {
      tag: "path",
      attributes: {
        d: "M6.252 19.248a9.25 9.25 0 1 1 11.496 0",
      },
    },
    {
      tag: "path",
      attributes: {
        d: "M10.468 14.285a2 2 0 1 1 3.064-2.572c1.141 1.36 1.834 3.755 2.14 5.029a.449.449 0 0 1-.624.523c-1.201-.523-3.439-1.62-4.58-2.98",
        fill: "currentColor",
        stroke: "none",
      },
    },
  ],
  clapperboard: [
    {
      tag: "path",
      attributes: {
        d: "M8.75 8v.75m0-3.75V3.75a1 1 0 0 1 1-1H11m8 0h1.25a1 1 0 0 1 1 1V5M14 2.75h2M21.25 8v2m0 3v1.25a1 1 0 0 1-1 1H19m-3 0h-.75m-.5-6.5H3.25a.5.5 0 0 0-.5.5v11.5a.5.5 0 0 0 .5.5h11.5a.5.5 0 0 0 .5-.5V9.25a.5.5 0 0 0-.5-.5",
      },
    },
  ],
  folder: [
    {
      tag: "path",
      attributes: {
        d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      },
    },
  ],
  "book-open": [
    {
      tag: "path",
      attributes: {
        d: "M12 7v14",
      },
    },
    {
      tag: "path",
      attributes: {
        d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      },
    },
  ],
  "sliders-horizontal": [
    {
      tag: "line",
      attributes: {
        x1: "21",
        x2: "14",
        y1: "4",
        y2: "4",
      },
    },
    {
      tag: "line",
      attributes: {
        x1: "10",
        x2: "3",
        y1: "4",
        y2: "4",
      },
    },
    {
      tag: "line",
      attributes: {
        x1: "21",
        x2: "12",
        y1: "12",
        y2: "12",
      },
    },
    {
      tag: "line",
      attributes: {
        x1: "8",
        x2: "3",
        y1: "12",
        y2: "12",
      },
    },
    {
      tag: "line",
      attributes: {
        x1: "21",
        x2: "16",
        y1: "20",
        y2: "20",
      },
    },
    {
      tag: "line",
      attributes: {
        x1: "12",
        x2: "3",
        y1: "20",
        y2: "20",
      },
    },
    {
      tag: "line",
      attributes: {
        x1: "14",
        x2: "14",
        y1: "2",
        y2: "6",
      },
    },
    {
      tag: "line",
      attributes: {
        x1: "8",
        x2: "8",
        y1: "10",
        y2: "14",
      },
    },
    {
      tag: "line",
      attributes: {
        x1: "16",
        x2: "16",
        y1: "18",
        y2: "22",
      },
    },
  ],
  grid2x2: [
    {
      tag: "rect",
      attributes: {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    },
    {
      tag: "path",
      attributes: {
        d: "M3 12h18",
      },
    },
    {
      tag: "path",
      attributes: {
        d: "M12 3v18",
      },
    },
  ],
  "image-plus": [
    {
      tag: "path",
      attributes: {
        d: "M16 5h6",
      },
    },
    {
      tag: "path",
      attributes: {
        d: "M19 2v6",
      },
    },
    {
      tag: "path",
      attributes: {
        d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",
      },
    },
    {
      tag: "path",
      attributes: {
        d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
      },
    },
    {
      tag: "circle",
      attributes: {
        cx: "9",
        cy: "9",
        r: "2",
      },
    },
  ],
  video: [
    {
      tag: "path",
      attributes: {
        d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      },
    },
    {
      tag: "rect",
      attributes: {
        x: "2",
        y: "6",
        width: "14",
        height: "12",
        rx: "2",
      },
    },
  ],
  plus: [
    {
      tag: "path",
      attributes: {
        d: "M5 12h14",
      },
    },
    {
      tag: "path",
      attributes: {
        d: "M12 5v14",
      },
    },
  ],
} as const;

export type SourceIconName = keyof typeof SHAPES;

export interface SourceIconProps {
  name: SourceIconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  title?: string;
}

export function SourceIcon({
  name,
  size = 20,
  strokeWidth = 2,
  className,
  title,
}: SourceIconProps) {
  const shapes = SHAPES[name] as readonly {
    tag: string;
    attributes: Record<string, string>;
  }[];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {shapes.map((shape, index) =>
        createElement(shape.tag, {
          ...shape.attributes,
          key: `${name}-${index}`,
        }),
      )}
    </svg>
  );
}
