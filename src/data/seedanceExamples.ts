export type SeedanceExample = { poster: string; video: string; label: string; creator: string; avatar: string; likes: number; aspectRatio: number };

type RawExample = [string, string, string, number, number];
const raw: RawExample[] = [
  ["user_3DgH8zZ7H7xieJnKMyo5N4NA9ge/hf_20260828_133607_f265c973-82fe-4f27-83a9-42d913a2289c", "yernaz", "https://d1xarpci4ikg0w.cloudfront.net/profile-avatars/v1/804fd0cc49c2122d14eac995882475b4.webp", 175, 0.5625],
  ["user_3DgH8zZ7H7xieJnKMyo5N4NA9ge/hf_20260828_132351_79618fbd-cc98-4ee0-ae44-cb79da5349f3", "yernaz", "https://d1xarpci4ikg0w.cloudfront.net/profile-avatars/v1/804fd0cc49c2122d14eac995882475b4.webp", 184, 1.333333],
  ["user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_041544_b5f84d9d-a9db-472c-9ece-fed23857b096_wm3", "higgsfield_hall_of_fame", "https://d1xarpci4ikg0w.cloudfront.net/profile-avatars/v1/2cb30a8fc20c2361efdef19178f29707.webp", 279, 1.777778],
  ["user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_041459_e02ab22b-6d8e-46bd-874e-8090a8f00799_wm3", "bourgeois_mean", "https://d1xarpci4ikg0w.cloudfront.net/profile-avatars/v1/e283a7668e1c184d7e8cc1c6e28a5673.webp", 205, 1.777778],
  ["user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_040632_12ff4cdd-bba8-4a6d-bff5-312d4a2cbb23_wm3", "jennifer_lopez", "https://d2ol7oe51mr4n9.cloudfront.net/anon_user_id/0925f9d5-cc71-459f-9ec0-98c2758f06e1.png", 296, 1.777778],
  ["user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_040418_e674bc76-e8c5-4099-bd5c-f871a9345cda_wm3", "artificial_penguin", "https://d1xarpci4ikg0w.cloudfront.net/profile-avatars/v1/e533023a4b65ec08cabfbf49c3f51c47.webp", 122, 1.777778],
  ["user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_035550_51b6328c-1648-411a-917a-1d8cecbd166c_wm3", "jighit", "https://d2ol7oe51mr4n9.cloudfront.net/anon_user_id/e77d75f0-5fc9-4c57-95bc-82b637fdb5f7.png", 236, 1.777778],
  ["user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_034505_9389c8eb-ce22-45df-8755-addfb794552f_wm3", "zhanay", "https://d2ol7oe51mr4n9.cloudfront.net/anon_user_id/1ffde5a6-9413-45f2-8729-9792d1864ed6.png", 383, 1.777778],
  ["user_3Btsg1RieQOoYK6o6x65C3UYqNH/hf_20260814_024423_23e78b00-c455-420b-b72f-fc8e9b14244c_wm3", "religious_raccoon_dark36", "https://d1xarpci4ikg0w.cloudfront.net/profile-avatars/v1/4a34830ee49abecde5763456cf2291e4.webp", 605, 1.777778],
  ["user_3Btsg1RieQOoYK6o6x65C3UYqNH/hf_20260814_013039_5cf05b01-4cea-4c9e-8af5-1b9122611c9b_wm3", "radiating_crystal_deep60", "https://d1xarpci4ikg0w.cloudfront.net/profile-avatars/v1/095ed28d4ee9d9d8da6bdbbc3a1e11b6.webp", 440, 1.777778],
  ["user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_002238_83054aec-92b9-4efe-b015-6c33e4bd7ba3_wm3", "banksy_pancake_gold22", "https://d1xarpci4ikg0w.cloudfront.net/profile-avatars/v1/d1839cf3967938ff5142ab2115b06c10.webp", 305, 1.777778],
  ["user_3Btsg1RieQOoYK6o6x65C3UYqNH/hf_20260813_235221_7969f2f0-4868-4639-b8f2-85ca915bdd6e_wm3", "gaziziz", "https://d1xarpci4ikg0w.cloudfront.net/profile-avatars/v1/4ac4894a2eaf7be3698900c7b61ba349.webp", 292, 1.777778],
  ["user_3FRnqOjr7P4vUmrsWyEzZbKAqVU/77406d67-d5db-4b1d-81e2-9e0139b39249_hs_wm", "smartbeetle1651", "https://d1xarpci4ikg0w.cloudfront.net/profile-avatars/v1/8af328c135276efcdb1af677033feea0.webp", 197, 1.777778],
  ["user_2urRVI1bCfxGUsP28tBUphocCbh/507bc86d-a335-48fb-8732-06695a749350_hs_wm", "land_art_pencil", "https://d1xarpci4ikg0w.cloudfront.net/profile-avatars/v1/1711799dd25894401b5cb739174bb30b.webp", 239, 1.777778],
  ["user_3CN3NlActPxxUfaXfH903u7EnPq/468db48f-512d-4ca0-b475-8011acc1e8eb_hs_wm", "folkemerald1346", "https://d1xarpci4ikg0w.cloudfront.net/profile-avatars/v1/2403335d3a58a6dd58d9c65d8430f11a.webp", 481, 1.777778],
  ["user_2urnL94WJ71YKcCUCm8E5tfhGy9/437a80c2-3e11-4650-8777-c06e7ca567c5_hs_wm", "arpanetus", "https://d2ol7oe51mr4n9.cloudfront.net/user_2urnL94WJ71YKcCUCm8E5tfhGy9/ad100ab0-a45b-4058-9bbe-ff92eece371f.jpg", 217, 1.777778],
];

// Keep the community gallery in the same visual order as the reference feed.
const communityOrder = [
  "user_3DgH8zZ7H7xieJnKMyo5N4NA9ge/hf_20260828_133607_f265c973-82fe-4f27-83a9-42d913a2289c",
  "user_3FRnqOjr7P4vUmrsWyEzZbKAqVU/77406d67-d5db-4b1d-81e2-9e0139b39249_hs_wm",
  "user_3DgH8zZ7H7xieJnKMyo5N4NA9ge/hf_20260828_132351_79618fbd-cc98-4ee0-ae44-cb79da5349f3",
  "user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_035550_51b6328c-1648-411a-917a-1d8cecbd166c_wm3",
  "user_3Btsg1RieQOoYK6o6x65C3UYqNH/hf_20260814_013039_5cf05b01-4cea-4c9e-8af5-1b9122611c9b_wm3",
  "user_2urRVI1bCfxGUsP28tBUphocCbh/507bc86d-a335-48fb-8732-06695a749350_hs_wm",
  "user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_041544_b5f84d9d-a9db-472c-9ece-fed23857b096_wm3",
  "user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_040632_12ff4cdd-bba8-4a6d-bff5-312d4a2cbb23_wm3",
  "user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_034505_9389c8eb-ce22-45df-8755-addfb794552f_wm3",
  "user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_002238_83054aec-92b9-4efe-b015-6c33e4bd7ba3_wm3",
  "user_3CN3NlActPxxUfaXfH903u7EnPq/468db48f-512d-4ca0-b475-8011acc1e8eb_hs_wm",
  "user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_041459_e02ab22b-6d8e-46bd-874e-8090a8f00799_wm3",
  "user_3HrUZEqvogBOowmw1C0BIb3oNDN/hf_20260814_040418_e674bc76-e8c5-4099-bd5c-f871a9345cda_wm3",
  "user_3Btsg1RieQOoYK6o6x65C3UYqNH/hf_20260814_024423_23e78b00-c455-420b-b72f-fc8e9b14244c_wm3",
  "user_3Btsg1RieQOoYK6o6x65C3UYqNH/hf_20260813_235221_7969f2f0-4868-4639-b8f2-85ca915bdd6e_wm3",
  "user_2urnL94WJ71YKcCUCm8E5tfhGy9/437a80c2-3e11-4650-8777-c06e7ca567c5_hs_wm",
] as const;

const orderedRaw = communityOrder.map((path) => {
  const example = raw.find(([candidate]) => candidate === path);
  if (!example) throw new Error(`Missing Seedance 2.5 community metadata for ${path}`);
  return example;
});

const posterOverrides: Record<string, string> = {
  "user_3FRnqOjr7P4vUmrsWyEzZbKAqVU/77406d67-d5db-4b1d-81e2-9e0139b39249_hs_wm": "https://cdn.higgsfield.ai/user_3Bu4J9LdRqhDHpwVUmDuiPIuIy0/hf_20260807_115856_816bc5fd-ea64-42ed-9c0c-d70e666a148f_thumbnail.webp",
  "user_2urRVI1bCfxGUsP28tBUphocCbh/507bc86d-a335-48fb-8732-06695a749350_hs_wm": "https://cdn.higgsfield.ai/user_3H8EAjd4lvlOfCDCxt4J3ZVPr1c/hf_20260807_105454_a60ef591-46a4-49a2-b01a-607dad928ede_thumbnail.webp",
  "user_3CN3NlActPxxUfaXfH903u7EnPq/468db48f-512d-4ca0-b475-8011acc1e8eb_hs_wm": "https://cdn.higgsfield.ai/user_3Bu4J9LdRqhDHpwVUmDuiPIuIy0/hf_20260807_100920_bc5eed39-89b5-449c-925f-933727ac4c07_thumbnail.webp",
  "user_2urnL94WJ71YKcCUCm8E5tfhGy9/437a80c2-3e11-4650-8777-c06e7ca567c5_hs_wm": "https://cdn.higgsfield.ai/user_3Bu4J9LdRqhDHpwVUmDuiPIuIy0/hf_20260807_101838_4b30080f-2172-46dd-add5-b813276d04f9_thumbnail.webp",
};

export const seedanceExamples: SeedanceExample[] = orderedRaw.map(([path, creator, avatar, likes, aspectRatio], index) => ({
  label: `Seedance 2.5 showcase ${index + 1}`,
  video: `https://d8j0ntlcm91z4.cloudfront.net/${path}.mp4`,
  poster: posterOverrides[path] ?? `https://cdn.higgsfield.ai/${path.replace(/_wm3$/, "")}_thumbnail.webp`,
  creator,
  avatar,
  likes,
  aspectRatio,
}));
