const CDN = "https://cdn.higgsfield.ai/cdn-cgi/image/width=1080,quality=80,format=auto/marketing-studio-v2-ad/";

export interface StyleItem { label: string; src: string; video?: string; aspect?: string }

const IMG = "https://cdn.higgsfield.ai/cdn-cgi/image/width=1080,quality=80,format=auto/";
const CDN_HF = "https://cdn.higgsfield.ai/";
const motion = (label: string, folder: string, id: string, poster: string): StyleItem => ({ label, video: `${CDN_HF}${folder}/${id}.mp4`, src: `${IMG}${folder}/${poster}.webp` });
const UGC_CDN = "https://cdn.higgsfield.ai/marketing-studio-v2-ugc/";
const USER_CDN = "https://d8j0ntlcm91z4.cloudfront.net/";
const ugc = (label: string, id: string, poster: string): StyleItem => ({ label, aspect: "aspect-9/16", video: `${UGC_CDN}${id}.mp4`, src: `${IMG}marketing-studio-v2-ugc/${poster}.webp` });
const user = (label: string, path: string): StyleItem => ({ label, aspect: "aspect-9/16", video: `${USER_CDN}${path}.mp4`, src: `${IMG}${path}_thumbnail.webp` });
const stat = (label: string, base: string, ext = "jpg", thumb = ""): StyleItem => ({ label, aspect: "aspect-9/16", video: `https://static.higgsfield.ai/${base}.mp4`, src: `https://static.higgsfield.ai/${base}${thumb}.${ext}` });

// Style cards per category; Product shot keeps the markup copied from the live page, the video tabs get data later.
export const STYLE_ITEMS: Record<string, StyleItem[]> = {
  Motion: [
    motion("2D product motion", "marketing-studio-v2-2d-motion", "83bcfb32-b4dd-47b5-9cfe-0ab09d971282", "88a427c2-1740-4493-a9c1-fd1588eaf5fb"),
    motion("Hypermotion", "marketing-studio-v2-hypermotion", "1c4141ef-07a9-42b2-998a-ea2208d000c5", "f10c27f6-d539-47ba-b3d5-d7a35eed3c51"),
    motion("Typography", "marketing-studio-v2-hypermotion", "a23c53dd-b07d-40f5-9d3a-c5c89fba8efa", "0f448fc0-d591-462a-ac07-c88976c3be64"),
    motion("Dark Minimalism", "marketing-studio-motion-preview", "acc1ab72-f43f-41d8-9d4b-9a72da284bab", "ad4a7c85-b598-4045-9f93-be7dba96b2ed"),
    motion("Color pop", "marketing-studio-v2-hypermotion", "5a9d5c90-c2f4-451a-8899-2a9e01f06316", "3e90ff54-e611-4ac4-8ab4-f7a14e18e478"),
    motion("Mixed media", "marketing-studio-motion-preview", "593b1f6d-1967-4dce-ac20-2d5df33e94b0", "5f8aabc1-cf28-48c1-bab6-63ceccd6a142"),
    motion("SaaS", "marketing-studio-v2-saas-motion", "f1e76327-8ab0-46c2-a436-445cfe9870cf", "a3b23783-514a-4823-8924-3159ee7bfed6"),
    { label: "Product Showcase", video: "https://static.higgsfield.ai/marketing-studio-presets/hyper-motion-mini.mp4", src: "https://static.higgsfield.ai/marketing-studio-presets/hyper-motion-mini-thumbnail.webp" },
  ],
  TikTok: [
    ["This Gadget Saved Me", "ugc_gadget_saved_me"],
    ["Couple Sharing At Home", "couple_sharing_home"],
    ["Selfie Testimonial", "ugc_selfie_testimonial"],
    ["Direct-to-Camera", "ugc_direct_to_camera"],
    ["Secret Hack Reveal", "ugc_secret_hack_reveal"],
    ["Camera POV", "camera_pov"],
    ["Classic Meets Modern", "classic_meets_modern"],
    ["Mess to Fresh", "mess_to_fresh"],
  ].map(([label, id]): StyleItem => ({ label, video: `https://static.higgsfield.ai/ms-modes/${id}.mp4`, src: `https://static.higgsfield.ai/ms-modes/${id}.jpg` })),
  UGC: [
    ugc("Shopping", "5a9ba7c1-144b-4158-8582-47548837dd85", "4dd6e4ce-b65a-46dd-9479-ed2b182ba44f"),
    ugc("At home", "a0a7c111-da50-4c3f-a2e0-172d4a9deefb", "b023a0f0-f13c-41af-b4ef-9bf0a123a39f"),
    ugc("Delivery", "a9f10f0d-0acd-4b86-9ee8-6e4d6a2bcb76", "86ede977-ab41-4894-945d-f5dc1113a5ee"),
    ugc("Review", "0307d62d-efd8-4906-9162-be99158d25fb", "c3f35825-20b9-4673-a508-9c9b20fcb3d4"),
    ugc("Try-on", "7a9bcdd4-c60f-4aea-ad4f-14b607479d76", "5624a15b-2117-419e-9341-752e20ef7d3c"),
    ugc("Unboxing", "73366684-a5c0-4c71-8061-95c7486deceb", "dedcc95c-0e28-4669-a239-37cbfa4a22f7"),
    ugc("Tutorial", "97464e03-828d-4177-a29d-11d165d2f7bb", "46c091cc-6f1e-47f0-82dc-14de2d65ea43"),
    ugc("Before/after", "703da148-3bfa-42d9-a674-4371ebbc857f", "fce5f2c3-6797-40a6-a701-ec4fa1f1c637"),
    user("Giant Figure", "user_3Cfdr00kbZ1hJCLpPQkaicInqxv/hf_20260603_150008_ee9cf142-7741-40e9-8076-897fb0947742"),
    user("Unboxing Virtual Try-On", "user_3Cfdr00kbZ1hJCLpPQkaicInqxv/hf_20260603_225935_abf54d8e-3766-4bf5-9163-2f87467c9953"),
    user("Unboxing ASMR", "user_3E2rnQvU0fCTk5iGN1MMbzgiYer/hf_20260604_151251_092a48c7-4867-41ca-8d63-dfb1526785fb"),
    user("Virtual Try-On Sneakers", "user_3DgH8zZ7H7xieJnKMyo5N4NA9ge/hf_20260603_235259_8a9eed37-73ed-4c71-b6a8-a462a60beb50"),
    user("Crush Test", "user_3Cfdr00kbZ1hJCLpPQkaicInqxv/hf_20260505_015725_c13394e1-02c4-48fe-9d61-94f340d0e7f4"),
    stat("Mystery Box", "ms-modes/mystery_box"),
    stat("Reboxing", "ms-modes/reboxing"),
    stat("TV Spot", "marketing-studio-presets/tv-spot-mini", "webp", "-thumbnail"),
    user("UGC Addiction", "user_3Cfdr00kbZ1hJCLpPQkaicInqxv/hf_20260603_153723_6b1bb39e-dd94-43fc-9fe8-007a658e49a5"),
    stat("UGC Virtual Try On", "marketing-studio-presets/ugc_virtual_try_on", "webp", "-thumbnail"),
    stat("Pro Virtual Try On", "marketing-studio-presets/virtual_try_on", "webp", "-thumbnail"),
    stat("Wild Card", "marketing-studio-presets/wild_card", "webp", "-thumbnail"),
  ],
  Ads: [
    { label: "Social proof", src: `${CDN}7d82b55a-294f-450c-8908-1c5c0ba34300.webp` },
    { label: "Comparison", src: `${CDN}2ed46ff0-7411-419f-a7a9-6472c97d3e5d.webp` },
    { label: "Problem → Solution", src: `${CDN}4dd1bb60-b4d0-4e6d-9a85-19e045dc06a2.webp` },
  ],
  Marketplace: [
    { label: "Bold headline", src: `${CDN}b5e7d2dc-1693-4c40-b315-21d96a045bb3.webp` },
    { label: "Product hero", src: `${CDN}073255fb-afec-403f-b194-04b673f36d82.webp` },
    { label: "Benefits", src: `${CDN}e0d40df7-359b-47fa-817f-7dd9e59d52e4.webp` },
    { label: "Feature callouts", src: `${CDN}11389d2f-1324-4a99-9a69-00b194bf695a.webp` },
  ],
};
