import additionalStyles from "./additional-styles.json";

const STYLES = "https://static-public-media.higgsfield.ai/what-if-styles/published/";

export type ContentFactoryStyle = {
  title: string;
  views: string;
  likes: string;
  video: string;
  poster: string;
  instagram?: string;
};

/** Cards recovered from the supplied HTML (the paste ended mid-way through the eighth card). */
export const CONTENT_FACTORY_STYLES: ContentFactoryStyle[] = [
  {
    title: "Haze Countdown",
    views: "3.4M",
    likes: "279.5K",
    video: `${STYLES}040e4aa0061dfb0f14e7de34a54fe75ccf2de3c7e796e5a616af6cf88bc78eac`,
    poster: `${STYLES}e0cfd82b68d60927791d6061d7e7627690a1e9519ee247f5950bb2eb237b21ce`,
    instagram: "https://www.instagram.com/reel/DeEhjjINJat/",
  },
  {
    title: "Pixel Night",
    views: "539.4K",
    likes: "11.9K",
    video: `${STYLES}acb45064cd115877d5288f3f8d9098ded0de9bcbe34048929832ae08df3a2a34`,
    poster: `${STYLES}17059de64f320602c63f84857654cc78f73e4fabcf62f11daac312003b0ff770`,
  },
  {
    title: "Heatwave Park",
    views: "2.6M",
    likes: "135.6K",
    video: `${STYLES}fd5531bbf0399e6efa245ab702015be557a8388c08c12988ea1a54ca1e61f2ba`,
    poster: `${STYLES}d7c460bacfe1860bd2f4bdf6ec694a2e7dc596df0bc171fa079c0cc8f8a29bb1`,
    instagram: "https://www.instagram.com/reel/DeUljqSoDs4/",
  },
  {
    title: "Night Scan",
    views: "174.4K",
    likes: "2.5K",
    video: `${STYLES}13ba62976f57d2acab115f35fd421a7f22ce2cf965baf21413905290791b740a`,
    poster: `${STYLES}d84916142cfc916c003018de56229ff160a6231c3df0eef92d4bb6580572369b`,
  },
  {
    title: "Toy Planet",
    views: "261.9K",
    likes: "6.6K",
    video: `${STYLES}cf3a78be1eff98c19c1b4ddac74b2547cb6437d54eb0a2f546c96641a0c85b05`,
    poster: `${STYLES}a1de0f9c0a694c30b867df6a6b97a0a69bf985cc4a6a7925b84e3bef10e9ee0f`,
  },
  {
    title: "Lowpoly Skyline",
    views: "26.6M",
    likes: "2M",
    video: `${STYLES}2edbd643bc23efbdc5188519d54dfa68f638df040840747ac2629e15360ac623`,
    poster: `${STYLES}edc05c775dc50fee411f59554d555bbc044d91d0d0f2277ad42c87d069f3d5d6`,
    instagram: "https://www.instagram.com/reel/DeKOI2OzCG2/",
  },
  {
    title: "Shard Pixel",
    views: "675.2K",
    likes: "13.4K",
    video: `${STYLES}f07164461052524d2346203c29602cf8fa1d93c771d56d8e957a80a908930ee5`,
    poster: `${STYLES}f478b77ed0b60dd76975dfb91952e4a46847a63a390a07c46bcd9df10026bd6c`,
  },
  ...additionalStyles,
];

export const CONNECT_URL =
  "https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Higgsfield&connectorUrl=https%3A%2F%2Fmcp.higgsfield.ai%2Fmcp";
