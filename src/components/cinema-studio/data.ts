export type Mode = "video" | "image";

export const CAROUSEL = [
  { t: "Cully Hill Boys", poster: "https://d2ol7oe51mr4n9.cloudfront.net/user_3GNcyaSCltezE7ot4WtRdn0jfo0/75d860f8-6dde-45d6-ae81-756ddbfe563e.jpg", video: "https://d2ol7oe51mr4n9.cloudfront.net/user_3GNcyaSCltezE7ot4WtRdn0jfo0/8379c8de-803d-4b40-ae7a-3029142566f6.mp4" },
  { t: "HELL GRIND", poster: "https://d2ol7oe51mr4n9.cloudfront.net/user_2v5txepAmNYZwyzml1nIizlWURE/df7107b3-1dd6-438a-a168-ed382e2ad901.png", video: "https://d2ol7oe51mr4n9.cloudfront.net/user_3GNcyaSCltezE7ot4WtRdn0jfo0/2157962f-698c-4884-8519-239c8776a2ea.mp4" },
  { t: "ZEPHYR: Special", poster: "https://d2ol7oe51mr4n9.cloudfront.net/user_3GNcyaSCltezE7ot4WtRdn0jfo0/9655238c-398d-4403-bc7d-68e3b43238cf.jpg", video: "https://d2ol7oe51mr4n9.cloudfront.net/user_3GNcyaSCltezE7ot4WtRdn0jfo0/56987630-1f4d-4c34-884f-822aaeac9bd5.mp4" },
];

const CDN = "https://cdn.higgsfield.ai/cinema_studio_40_creative_controls/";
export const cdn = (id: string) => CDN + id + ".webp";

export interface Media { image?: string; video?: string }
// Genre art: Epic/Drama have posters; Epic, Drama, Action, Adventure and Comedy have looping videos; the rest use the animated gradient.
export const GENRES = ["General", "Epic", "Drama", "Action", "Adventure", "Comedy", "Horror", "Thriller", "Sci-fi", "Western", "Noir"];
export const GENRE_MEDIA: Record<string, Media> = {
  Epic: { image: cdn("aeb0bea6-e268-439c-92e4-9c2ff4966571"), video: CDN + "a3129a2d-e132-4e67-9edc-f5d0075191ca.mp4" },
  Drama: { image: cdn("1a6cab3c-b6eb-4930-998e-8359fc64a4b6"), video: CDN + "6913dc79-1b79-48bb-b7b3-4af4264beac8.mp4" },
  Action: { video: CDN + "b2ae8058-ae8a-4708-b004-db614eaa02e5.mp4" },
  Adventure: { video: CDN + "6dbee35e-506a-4459-a7b2-ff08dc8921bb.mp4" },
  Comedy: { video: CDN + "1d5bace2-93f0-49c0-84df-bdfd4ebf84b4.mp4" },
};
// Era looping videos; "Auto" keeps the gradient preview.
export const ERA_MEDIA: Record<string, Media> = {
  "2020s": { video: CDN + "7c088434-9419-4b45-951e-b1b6117fbd65.mp4" },
  "2000s": { video: CDN + "cd12c346-7515-4a65-a58c-b9ede3185486.mp4" },
  "1990s": { video: CDN + "5ab5e82e-9413-49b5-ad09-e0990fea22ee.mp4" },
  "1980s": { video: CDN + "ebb72ac5-bbfb-4652-81a3-98126e69f48b.mp4" },
  "1960s": { video: CDN + "49f1cec3-9b30-4570-9b9d-c411a426eea1.mp4" },
};
export const GENRE_HUES: Record<string, [string, string, string]> = {
  General: ["#3f8a1c", "#f2c230", "#c9e07a"], Epic: ["#6a4a1a", "#e8b46a", "#2a1a0a"], Drama: ["#5a3b6a", "#c97a5a", "#e8c9a8"],
  Action: ["#b34a1a", "#f0a53a", "#5a3b2a"], Adventure: ["#1f6f6a", "#e8c07a", "#7fb0a0"], Comedy: ["#d9893a", "#f4d35e", "#e86a92"],
  Horror: ["#2a0d12", "#8a1c1c", "#3a3a45"], Thriller: ["#14232e", "#4a7a8a", "#c9d2d6"], "Sci-fi": ["#1a2a6a", "#3ae0d0", "#a67aff"],
  Western: ["#8a4a1a", "#e8b46a", "#d9c29a"], Noir: ["#111", "#777", "#ddd"],
};
export const ERAS = ["Auto", "2020s", "2000s", "1990s", "1980s", "1960s"];
export const ERA_HUES: [string, string, string] = ["#4a5fd0", "#f08a5a", "#f5d6a8"];

export interface Tempo { name: string; image: string; video?: string; segments?: number[] }
export const TEMPO_ITEMS: Tempo[] = [
  { name: "Dynamic", image: cdn("c4bf8547-5047-4f38-b18a-44b141773960"), video: CDN + "7d9d7918-cb17-47eb-9cae-c2a64695282f.mp4", segments: [1.5, 0.667, 1.541, 1.084, 1.416, 0.875, 0.917, 0.708, 1.334, 0.041] },
  { name: "Calm", image: cdn("ab84020a-ef8b-47ea-80d5-8466e4103d4d"), video: CDN + "0ad23d54-7233-468d-9587-31dd033428b1.mp4", segments: [2.833, 3.875, 3.334] },
  { name: "Single shot", image: cdn("d19773a8-a734-45d2-94ab-2ea038c65dc4"), segments: [10.042] },
  { name: "Auto", image: cdn("c99aea1c-78e7-41ca-b90f-86785b892f43"), video: CDN + "97a8f939-9cfa-4527-a3f1-58be06ace187.mp4" },
  { name: "Chaotic", image: cdn("6e05bd09-800f-4a41-9910-96a09662efcd"), video: CDN + "2acc2bfe-e9b8-4fbf-9b2f-5288c65ab016.mp4", segments: [0.875, 0.708, 1.25, 0.709, 1.208, 0.708, 1.042, 1.542, 0.666, 1.334, 0.041] },
];
export const TEMPOS = TEMPO_ITEMS.map((t) => t.name);

export interface WheelItem { name: string; image?: string; auto?: string }
const AUTO = "https://static.higgsfield.ai/public/cinematic/v40/";
// Wheel order matches the live Camera setup (each wheel loops).
export const CAMERA_ITEMS: Record<"camera" | "lens" | "aperture", WheelItem[]> = {
  camera: [
    { name: "35mm Film", image: cdn("70b1c8ee-2bb4-419e-85c3-aa9ed3c50b05") },
    { name: "8mm Film", image: cdn("759c3c39-f578-4b3b-a8f0-66ca4ca541e6") },
    { name: "DV Camcorder", image: cdn("c8e40116-cd9f-4ec1-a6c2-53e4a80847ff") },
    { name: "Auto", auto: AUTO + "camera-auto.svg" },
    { name: "Modern", image: cdn("f4bc612a-f161-4cea-8c87-31131bbc74a2") },
  ],
  lens: [
    { name: "Clean Sharp", image: cdn("d3384005-bd42-42ab-bfff-4436b34313b8") },
    { name: "Anamorphic", image: cdn("a0e62992-8272-4704-a01b-7ba6d9a10be2") },
    { name: "Vintage Anamorphic", image: cdn("7a87b046-9c3f-4747-bb38-fcb1f4b219e4") },
    { name: "Warm Vintage", image: cdn("d30da6a5-7730-4098-8d39-e44a915cffee") },
    { name: "Halation Vintage", image: cdn("02c31fbe-4218-4534-8849-de230e7c099e") },
    { name: "Auto", auto: AUTO + "lens-auto.svg" },
  ],
  aperture: [
    { name: "f/1.4 Wide Open", image: cdn("7147405f-9606-4aca-94ea-361c3c0f739e") },
    { name: "f/4 Moderate", image: cdn("69de716e-cd2a-4d01-9faa-d4e38c0194b7") },
    { name: "f/11 Deep Focus", image: cdn("1cba04c8-4cab-4b6e-a72a-d17bedfaa970") },
    { name: "Auto", auto: AUTO + "aperture-auto.svg" },
  ],
};
export type CameraCol = keyof typeof CAMERA_ITEMS;

export interface Movement { name: string; poster: string; video: string }
// [name, poster id, video id] per move, in the live order.
const MOVE_IDS: [string, string, string][] = [
  ["Snorricam", "f74144c0-afc3-4d7e-b07b-76b16b6cd187", "41f533bc-e56a-4807-9966-1b7f487a6fa4"],
  ["Robot arm", "08dd3e7e-45ab-4c33-b035-3ffb132e241e", "9be4a814-7030-416f-9e02-4d99dd92b9b2"],
  ["Tilt up", "ab10a655-8901-4dd7-8c54-0c76d88a6a62", "9ad89e82-805c-4f66-8ce4-80c401e075ff"],
  ["Rack focus", "a85cb540-7108-45e3-ac63-bf3ed2de42d7", "f86bd18a-e233-4d3f-bc1c-2e5c08c02c69"],
  ["Tilt down", "c5d8fd64-4242-4de5-b941-27ba1b7a684c", "551af919-f1f4-4d5e-8eef-1ac88295bd5d"],
  ["POV", "6031271f-54fd-4d12-97bf-f1cd340aa269", "167fc048-db8a-4205-90ef-3712b355d0f6"],
  ["Pan left", "c5cdbc2f-1044-4f3d-924d-bd8516f15063", "81867a75-9f71-4443-91f3-040569107597"],
  ["Crane up", "e665aeba-0b1a-45d7-bcea-86a010baa9f7", "16c732d0-1478-4597-9a72-2f1bacebfb53"],
  ["Pan right", "63ecb1ea-df5b-45e6-bff9-079a1a6fd23f", "5b9ad1d2-0e1c-4b68-85e5-5980a5a1e71d"],
  ["Crane down", "459b7457-eb08-405a-8eda-ee15b871bf29", "6338e059-21f3-4504-92cc-d4eca0a52a3a"],
  ["Side tracking", "c076f77c-627b-4f87-90d2-3478024142cd", "1e89e2a8-a99d-433a-9af7-703a6bfbe83e"],
  ["Pedestal up", "f5877174-1a69-431a-95f4-02b5f115b72b", "9d4269ee-cef4-40d4-affa-073c387efbd3"],
  ["Pedestal down", "0b11f953-2cd4-4b80-ba5e-50c28d240b56", "dcb7fe2a-486e-4550-a254-eaa5259c7221"],
  ["Handheld", "9dd7f7f2-4525-4e1a-bce8-1c77bdcde538", "40c95353-6037-4a00-a7ba-7dab09ef9e64"],
  ["Tracking", "d352b3b2-d161-4f36-b62d-05707c357beb", "ca7dc056-0e87-4398-b96d-cc59fae0024c"],
  ["Drone orbit", "dde2ae70-9d21-45ef-996f-c5a73c0e1aef", "14f5b72a-7202-41cc-8f35-cc468eab9db1"],
  ["Dolly zoom", "6f9ced07-5f77-49a3-a79c-e2608f5c5bb6", "8aa44e1d-32e8-4368-9a47-f40ffda77d5a"],
  ["Aerial pullback", "ff4d0638-b321-4054-8444-37c7c86c07b0", "e6233943-40ee-4a82-88c5-052e262b7eff"],
  ["Static shot", "dd8b74ed-ab90-4eca-8f7d-00d4e4dd364c", "a8449dc8-41ec-49fc-90f4-81d74d9f7066"],
  ["Bullet time", "32a345fc-4f06-4392-a9fe-39f411922a70", "4e24525e-b626-4ac0-a22a-2365fee28c2c"],
  ["Whip pan", "bff738bb-888a-49c7-9e35-29c891298d12", "3b30b328-199f-456d-84c6-a4b20efcadf3"],
  ["Slow zoom in", "e514e07b-ee64-4b2a-bd2b-807643d7b132", "fd673dee-53c4-4cfa-a7f5-9690c407cab8"],
  ["Arc left", "73f89729-35d9-4100-b840-59dacf819ae4", "052d0323-8a28-41ce-b7bc-db94e39580b9"],
  ["Slow zoom out", "9d9895e4-37e7-4dc9-baa5-673a5b408a8f", "c2046a8a-831e-4aa2-a8b3-6a05e384b2c0"],
  ["Arc right", "40bd5464-c4db-492a-9334-28c0a03ef23f", "11688e66-674d-45f5-9f9b-4543974ad12c"],
  ["Truck right", "599ecaf0-2efb-4f91-af04-00ab4db120dd", "bd898ff8-e0a8-4b44-a41f-ceb723e5b414"],
  ["Dolly in", "f2d19ee8-6f11-424a-b8ee-ec4b919b6124", "801093dc-0817-44ba-87da-6e544f218c0e"],
  ["Truck left", "1b7cb488-d455-4fca-9560-395d98eda3da", "4908b3bd-26b4-4c6d-8414-c4f093858066"],
  ["Dolly out", "a3b7d521-9e89-4bda-b20e-f0efbfb239d0", "5fab33de-d50b-4eea-bac1-d1605bc88a80"],
  ["Slider right", "3c2bc6c0-b1dd-48b0-831e-c2a7ca1838e8", "47b73a55-9dc7-4826-b7ea-71d33c3793a3"],
  ["Crush zoom", "2fc0b86d-a755-48e7-aa33-b7080fa6a36c", "7e76d6a7-7360-4254-8c0c-7afbec20248a"],
  ["Slider left", "db4ff5ec-8386-46d5-b907-1d9eb0cc59df", "809b7c81-8ce9-4d6c-b042-dcb46cfb0e9b"],
  ["Helicopter shot", "9f351ee9-54e8-4b4a-b104-1bbd7f8db714", "c5f97f2c-f96b-479c-a2ff-ae37e7d79b07"],
];
export const MOVEMENTS: Movement[] = MOVE_IDS.map(([name, poster, video]) => ({ name, poster: cdn(poster), video: CDN + video + ".mp4" }));

const PRESETS = "https://cdn.higgsfield.ai/cinema_studio_40_color_presets/";
const rgbs = (s: string) => s.split(";").map((c) => `rgb(${c})`);
// 12 swatches per palette; the last one is the card's base tint.
export const PALETTES: { name: string; image: string; colors: string[] }[] = [
  { name: "Static Noon", image: PRESETS + "abbce116-ac86-4d35-84d9-b0adff031962.webp", colors: rgbs("12,12,12;40,41,42;78,79,81;98,98,99;162,89,85;123,123,123;147,149,72;167,167,166;193,194,194;182,198,183;237,237,237;105,72,59") },
  { name: "Twilight Fable", image: PRESETS + "7104bc8d-f658-414e-b5c5-a34b87c7dfae.webp", colors: rgbs("4,6,5;30,79,89;93,70,35;123,93,53;54,121,127;148,128,82;178,162,74;86,175,174;136,178,201;218,197,147;243,244,234;118,64,25") },
  { name: "Back Row Kissing Seats", image: PRESETS + "5b59386f-4fe9-48c2-9723-d98783458ccf.webp", colors: rgbs("7,4,5;78,19,17;26,67,136;135,80,70;178,106,56;96,121,195;45,167,68;184,152,146;132,110,105;156,205,138;196,199,210;136,25,19") },
  { name: "On the Other Side of the Porthole", image: PRESETS + "74e3315e-c581-47d8-bd42-89f67993ca55.webp", colors: rgbs("9,7,9;114,11,17;71,69,72;61,83,125;147,53,66;119,99,67;113,114,110;150,156,158;157,187,216;198,191,181;163,203,169;184,45,28") },
  { name: "The Emerald Ambush", image: PRESETS + "269a3671-1c7f-4f8f-900d-cf1192cbdcc1.webp", colors: rgbs("16,18,16;75,77,45;60,76,123;100,87,75;61,112,59;105,134,167;149,155,135;202,158,128;190,190,193;152,208,213;240,247,240;29,72,27") },
  { name: "Highway Standoff", image: PRESETS + "dfa8708a-adbf-4375-a3df-768f4465e6a8.webp", colors: rgbs("13,17,12;54,70,63;105,53,26;99,90,57;33,92,167;96,119,101;134,118,96;155,156,133;190,179,137;173,199,174;238,230,194;15,28,121") },
  { name: "The Faded Fresco", image: PRESETS + "3a1a5e27-f010-490e-b88d-84a480e2d440.webp", colors: rgbs("20,18,14;75,69,54;109,68,62;91,84,77;100,104,100;122,107,98;140,135,125;162,149,127;180,184,161;203,209,150;201,225,199;184,181,146") },
  { name: "Oil & Ochre", image: PRESETS + "8d5f2cc0-959e-44ac-a4a8-89803cb4ffe8.webp", colors: rgbs("13,13,10;52,38,25;82,70,40;101,78,56;109,105,50;99,105,98;147,137,111;174,164,131;208,166,129;224,208,167;225,220,200;141,121,65") },
  { name: "The Mountain Convent", image: PRESETS + "db7fd459-9518-43de-8f75-25d57c8cf783.webp", colors: rgbs("10,10,7;52,47,31;70,77,71;105,80,55;64,94,45;100,98,87;126,128,121;126,161,199;178,158,115;177,183,185;198,215,222;148,36,23") },
  { name: "Ghost in the Code", image: PRESETS + "5a3f634a-3a49-47b8-a3df-438f42b9ee5e.webp", colors: rgbs("4,6,5;27,51,29;102,72,54;60,96,82;105,103,71;129,131,128;146,131,99;106,147,135;184,173,154;191,225,200;230,235,233;99,138,99") },
  { name: "Pink Velvet", image: PRESETS + "5353b968-27ea-4f7d-a218-391a3ddabafd.webp", colors: rgbs("13,12,15;104,47,29;32,82,121;124,81,68;48,120,163;153,109,115;127,129,141;210,157,159;221,167,128;215,197,200;239,220,213;159,20,11") },
  { name: "Two Days to the Horizon", image: PRESETS + "0cec6501-eabd-4705-99ed-f5e18d40f553.webp", colors: rgbs("6,8,5;37,72,80;85,72,44;119,76,24;105,108,83;85,128,133;130,135,103;192,168,117;167,186,166;204,201,164;226,229,203;152,131,87") },
  { name: "Industrial Fog", image: PRESETS + "37cb0b27-ebd2-410a-8ca3-ef3fa29ce9f7.webp", colors: rgbs("18,16,18;48,13,11;77,72,64;110,79,66;93,88,87;110,110,112;127,129,128;152,154,153;173,178,177;196,176,154;204,206,208;86,27,17") },
  { name: "Stairs Go Up", image: PRESETS + "4ba81239-256f-481e-a08c-cabf39f67a58.webp", colors: rgbs("5,11,14;61,48,31;55,81,51;80,87,77;112,91,68;85,124,118;159,136,101;135,162,144;76,185,163;190,190,155;178,208,181;129,79,33") },
];

export interface LightingPreset { name: string; image?: string; video?: string; css?: string }
// [name, poster id, video id] in the live order.
const LIGHT_IDS: [string, string, string][] = [
  ["Auto", "468c6074-9645-4cc3-b632-ba4be3d20e63", "72232455-c7bf-4613-ab29-b77e8ab47c56"],
  ["Silhouette", "574c8be8-6572-488c-bd92-0d4efb1e76b2", "436a4b98-59e2-42ef-bbfd-6afa9b2d086a"],
  ["Practicals", "f9cc8c79-110b-4456-b068-2dd3d5941869", "430248d6-d196-4644-9acd-5bd971df502a"],
  ["Window", "659c4612-b39e-4c09-8a61-36f5bea142ad", "ae22f7b5-e044-4f96-bcd9-b87cc677a569"],
  ["Overhead fall", "96ecf21a-ddeb-4701-a815-b9a2274c4f4f", "c8c80362-5f11-4bbc-88f9-61e4277c575a"],
  ["Contre jour", "445d44ac-368e-45a6-b3cb-91e9a6585af6", "f55691e6-714c-4c83-b51f-f3b1eb920b27"],
  ["Soft cross", "0cfc70a8-ecb9-4d79-a779-79e6d3fdc2c5", "9f754037-bd34-4ce2-8c4f-4489bc280c46"],
];
export const LIGHTING: LightingPreset[] = LIGHT_IDS.map(([name, image, video]) => ({ name, image: cdn(image), video: CDN + video + ".mp4" }));

export interface ModelEntry { id: string; name: string; desc?: string; badge?: "TOP" | "NEW"; res?: string; dur?: string; cinema?: boolean }
export const CINEMA_MODELS: ModelEntry[] = [
  { id: "cinema-4", name: "Cinema Studio 4.0", desc: "Direct every shot with film setup, camera and lighting", cinema: true },
  { id: "cinema-3.5", name: "Cinema Studio 3.5", desc: "Camera selection, style presets, and AI director", cinema: true },
  { id: "cinema-3", name: "Cinema Studio 3.0", desc: "Enhanced camera and speed ramp control", cinema: true },
  { id: "cinema-2.5", name: "Cinema Studio 2.5", desc: "Camera movements with start frame", cinema: true },
];
export const FEATURED_MODELS: ModelEntry[] = [
  { id: "seedance-2.5", name: "Seedance 2.5", badge: "TOP", res: "1080p", dur: "4s-30s" },
  { id: "seedance-2.5-draft", name: "Seedance 2.5 Draft", badge: "NEW", res: "480p", dur: "4s-30s" },
  { id: "genjutsu", name: "Higgsfield Genjutsu", badge: "NEW", res: "1080p", dur: "4s-30s", cinema: true },
  { id: "genjutsu-lite", name: "Higgsfield Genjutsu Lite", badge: "NEW", res: "1080p", dur: "4s-30s", cinema: true },
  { id: "kling-4", name: "Kling 4.0", badge: "NEW", res: "1080p", dur: "5s-10s" },
];
export const IMAGE_MODELS: ModelEntry[] = [
  { id: "soul-cinema", name: "Higgsfield Soul Cinema", desc: "Cinematic stills with character consistency", cinema: true },
  { id: "soul-2", name: "Higgsfield Soul 2.0", desc: "Photoreal portraits and fashion" },
];

export const RESOLUTIONS = ["720p", "1080p"];
export const RATIOS = ["16:9", "9:16", "1:1", "4:3", "3:4", "21:9"];
export const DURATIONS = ["4s", "5s", "8s", "10s", "15s", "30s"];
export const IMAGE_RESOLUTIONS = ["1k", "2k", "4k"];

export const CHAR_TABS = ["All", "Soul", "Soul 2.0", "Soul Cinema"];
