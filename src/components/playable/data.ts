// Card manifest extracted from the supplied Playable page markup, in source order.
// Hashes are copied verbatim; preview URLs intentionally have no file extension.

const MEDIA = "https://static-public-media.higgsfield.ai/playable-ads-explore-presets/published/";
const CDN = "https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,";

export const PLAYABLE_CATEGORIES = ["Shooters", "Runners", "Adventure", "Puzzles", "Strategy", "Maze", "Simulation", "Action"] as const;
export type PlayableCategory = (typeof PLAYABLE_CATEGORIES)[number];

export type PlayableGame = {
  id: string;
  title: string;
  category: PlayableCategory;
  /** Largest (1920w) thumbnail, used as `src` and as the preview poster. */
  image: string;
  srcSet: string;
  /** Looping gameplay preview from the card's <video> element. A recording, not an interactive build. */
  previewVideo?: string;
  /** Interactive runtime URL. None were present in the supplied markup. */
  playUrl?: string;
  presetId?: string;
  prompt?: string;
  promptComplete?: boolean;
  dimension?: "2D" | "3D";
};

export const PLAYABLE_IMAGE_SIZES = "(max-width: 768px) 384px, (max-width: 1200px) 33vw, 15vw";

const imageUrl = (hash: string, width: number) => `${CDN}width=${width},quality=85/${MEDIA}${hash}`;

const GAMES: [id: string, title: string, category: PlayableCategory, image: string, preview?: string][] = [
  ["lantern-depths", "Lantern Depths", "Maze", "6c423f47c45a8a204dc36a4a77fe8e11b9a6a41351f1f991538d26ebddc383f2", "e9bc27f5a859c0c13c7da0a95accf0c1b5a5d7610c73791e6b2d1bfabdf1fd91"],
  ["pixel-legion", "Pixel Legion", "Strategy", "ca14fc9d79d8586418b46a4a0c80340977c0bbeb24da11dee7995659935ceac7", "c06630d0b9fdbfac2c72881df7b0f36c68c4768eec23032a46ac22bb929b18cd"],
  ["summit-rush", "Summit Rush", "Runners", "5ed36d2b5446d7151b75c178681a364bf35866fa5a3df17e047a2730dd60f944", "13e75317c8d8891392c8b9c6c8394c0116cf1995ba0165e844a22e280f598a6a"],
  ["suds-and-stripes", "Suds & Stripes", "Simulation", "9cae4187895414e919e1ffe66ca369d0c97d02ab75be65a10f087545126d0a4e", "1b2fe8235aae7def1b3a06bca279ddb43955e58eb9ba5245bbbb97ae06bde5cf"],
  ["petal-spin", "Petal Spin", "Action", "78d9f9ba10bd2bfbcaab1d039e2242922c6d8e176a7ceb6d94c4884cce605ead", "33037117d3540f239f8a5dac179b54f87d0d31499e2f6f51a16acbc511919f14"],
  ["glowfair-rally", "Glowfair Rally", "Runners", "c147b4de8b55a33ed6ea2db2c86e8d0ef23c34f3a38d57ab952bf49c8bef5590", "888d0c272118b17a0215db772c5927118510b91e5d5941463320827cca01374a"],
  ["sling-raiders", "Sling Raiders", "Action", "ae3b33a457fec44720d2d38380f20bea5b6d844ac460f11c37c041c555f9c743", "f356f2a1b97ac2aa1c7878358c5e0c47c711a5eef1a7cf25c971a8c8021395c0"],
  ["power-paws", "Power Paws", "Runners", "6315bc3d736163da243d9162ee2f0e1b9be4e9bf6788b19aa94b2ed9dbcb5cf3", "a1fb6af5945d3ad9958d631f2901e005b4d4ba487f0e881f564b5390d70e9486"],
  ["crowd-surge", "Crowd Surge", "Runners", "6c5cd479e12f066bb77e2abd9da80ae9c4b1bc5ce7db62a1a0e52020e2cdbbe0", "feb518f6cebafe3bbe013e6b1ac93f1d8814aed5c1ae658027ed7e0dd0d89add"],
  ["hive-haul", "Hive Haul", "Strategy", "147a18c0ec04b01337a06ca44c89f4ab0ae7c966a65cc3e4666691fa81f3f9b8", "5e0f18611d967a43f3ba8a55bd7cc7ad09bd58b1559d994a46e3e5f01a43dd96"],
  ["wisp-barrage", "Wisp Barrage", "Shooters", "a70c501ec9fb519e4b3c9eb6fb1d07b4fd83884e0e38c5ea23c1063f8ddf21ba", "6fdbb24056cd94591f060015d847b003eddcbbf7cc5cacf3a6e78600c196f90a"],
  ["lane-legion", "Lane Legion", "Shooters", "71a4d1db4dd96a00e9bd4beb711eac7b0498db9688b2df91a266f87885c3a3e3", "f5f4779e3b3df107273181869a10872a3399b20cab22299b73fe997820823ff4"],
  ["ember-knight", "Ember Knight", "Adventure", "060aa5763dd095bab5910fc59049ca3a3f5135812615046f53c09282e3f401ee"],
  ["sandstone-secrets", "Sandstone Secrets", "Adventure", "bad87970b88e909ed1b877845c163b89f314b27ef8019089530175d381f05692"],
  ["gridlock-out", "Gridlock Out", "Puzzles", "2480c4585a3ed3234718f17b7d4a0c7ea5b4492411ba89edb9418bea429fc65c"],
  ["frosty-slide", "Frosty Slide", "Puzzles", "acdd336ae1416b8ddf8c5a9e8d577a9146e25c4526eef7e74cc00f7b3ed316eb"],
  ["frostbite-haven", "Frostbite Haven", "Strategy", "b584abe7c7047740af239a1c068d266e87dc57359e3e6511a352b87e945323c0"],
  ["oasis-keeper", "Oasis Keeper", "Strategy", "ef6a0bb9a6e2de7317c0c981233f090311123692e14cbc79402712d76ddb6ea4"],
  ["red-acres", "Red Acres", "Simulation", "dc1e6894b47d88fd038fa0499a1d18aed2cd93c8bae0703acfdfa84a39e09745"],
  ["quiver-keep", "Quiver Keep", "Shooters", "1b3e53e13adde7ce53e54007d2786b3fd4552786f638063f1f309bf930e958f6"],
  ["coilbreaker", "Coilbreaker", "Shooters", "3e92c2412766a5d17c89a0349a9414074197b25f2a77ff8ded02220594a44c4e"],
  ["egg-valley", "Egg Valley", "Strategy", "46780d09bdc229472c877726f1dccfbdce7fff8d3abe21a448da00e594996b8c"],
  ["parapet-panic", "Parapet Panic", "Shooters", "668c3455351031c3490c9afee01ef371228a6773d774bed47aa0d1eb92eaa918"],
  ["meltline", "Meltline", "Shooters", "708a7e5cdf0eba8ad995510f485e2a7c6e2fe755e691df8d885206a7c2595a9e"],
  ["scoop-runner", "Scoop Runner", "Runners", "1216db0e61dbac3a161c677bd8fd2c7b8d2493aa8580ff669dda1fb14aa1d2ba"],
  ["prompt-tycoon", "Prompt Tycoon", "Simulation", "047e09e95b75340da379553a703ce3c6132a18b3ad74343c454da6032335bdd9"],
  ["neon-siege", "Neon Siege", "Strategy", "26c84440faca3039a6cd978449984d94ffa3598ea9a6557d1cb74e10cedd3a71"],
  ["tilt-temple", "Tilt Temple", "Maze", "d88f4bb75d5ef814a3478f7305181421808435c037e5b6d83220ae3d7491341a"],
  ["gummy-shove", "Gummy Shove", "Shooters", "c47d7630141de98be2b96aa9a6d39215b82ab875b63f9b62db3e9db63c2af9df"],
  ["gummy-squad", "Gummy Squad", "Shooters", "cf4a1f28a2ec963ac77928fa9544c191c6b1176e25f875734491561058b0b8ea"],
  ["maze-mob", "Maze Mob", "Maze", "a99d25cece9ea899986c2a4fa568031b43cbd91363ce0f6dfe129ae7e6123be2"],
  ["frost-coil", "Frost Coil", "Puzzles", "cb23ef3f0ff8a11fd0907be2f0c6471000c9a9ba3512f6d556006cdb02cfd7c0"],
  ["raft-drift", "Raft Drift", "Adventure", "cc70df2ec702f29f57a1683bf68d1e88dca3e0d27c3360756b75ba99b4f72e0d"],
  ["harvest-hero", "Harvest Hero", "Simulation", "7fe6d19d7ec0aac040f70fd9456803e78543d642e90f9f804ed6ba6e3c0b7416"],
  ["lagoon-lift", "Lagoon Lift", "Simulation", "8dd54792b99214a74f072e1f83f479d14f2b5fc605f9c50bb69ad71a1fd66541"],
  ["pie-patch", "Pie Patch", "Strategy", "004cfb2bd60c4934c7999ceb779b9a97dbd7c38db8503c4a90aef7d2a678d171"],
  ["emberwell-springs", "Emberwell Springs", "Strategy", "f0477cdd0b1883daec5194f9d3e51590d4afad606624eda5aef995fd2427ad59"],
  ["sky-marble-run", "Sky Marble Run", "Runners", "c88ff3c55a2bc9f8714fdde75e5b989cff1b039ba7afa64c718a37978313d8db"],
  ["dungeon-sum", "Dungeon Sum", "Maze", "056cdb58ed8e06672b183639ea52e3ab8bb6445268de88227eea3bb29c7d85c3"],
  ["jelly-peaks-run", "Jelly Peaks Run", "Runners", "0db84271513f5206317562dfa8dd90269a35089fabc75af78cba3addf36e464e"],
  ["treat-trio", "Treat Trio", "Puzzles", "edb875806e08d16e227c9b59a16d22d29fd31fe6552a711bba20726379676786"],
  ["glacier-gala", "Glacier Gala", "Action", "18343cbe5139eb50189fd4fe72f768a490db6531ad0389fbbbd77ee19cac1ec2"],
  ["frozen-crown", "Frozen Crown", "Maze", "e7a2c61a28eb008d4dd1c81d6ce2cf898895310e1cc8c76ead28dead731fbfdc"],
  ["pip-and-the-stolen-cake", "Pip and the Stolen Cake", "Adventure", "5eb52b12ee5af7c4b12821f0c822b3cc5240ee7872465e6c2b309a2712e684fb"],
  ["petal-ronin", "Petal Ronin", "Action", "361a73d7d94d4c3408c7a8c61d64c194d846d6f609827f7c6c4235dda4e2552c"],
  ["ember-wyrm", "Ember Wyrm", "Shooters", "45d794fba8c0e6972dacd9a5875fe0d3050907cabe5a37a8583a0b5a5afe4c74"],
  ["mesa-march", "Mesa March", "Shooters", "38d39084b329782569ec00ccc23d4fc2ea7bd49ef1a8e53439ae4ce0dcf5002c"],
  ["relic-rush", "Relic Rush", "Adventure", "2845e93fb59a11ec0d626340df132445069c6f1cb46b87f5159ce7e493f083ed"],
  ["tailblade", "Tailblade", "Shooters", "a2d4e66539a5eecb6b7c7cd156b7a66a1a6f7b332dffc1b632bf582f249c6744"],
  ["juice-blade", "Juice Blade", "Puzzles", "53395a3af4f2c4b7503ecf3f0b0b053c614414ff9962028baa0291a67bd09fd7"],
  ["bolt-drop", "Bolt Drop", "Puzzles", "9b20ccd9a9e0e2d9116d487def95a7968c5d98d48317010d9cbab4419e555d4a"],
  ["glow-clinic", "Glow Clinic", "Simulation", "92ee4b4e5b668e482ed142581f98216cf7169193d871b9ef01ad2d388a9a304d"],
  ["sand-savers", "Sand Savers", "Puzzles", "9cd3e6f84c6148930017508e5d141e245d264efb0d27fcdb700fad9ca7192b1c"],
  ["reef-rampart", "Reef Rampart", "Shooters", "642f53a4a2b8f7ba860d435737fd17b23e4bfa67d203bc874f4fc2cb8e53815c"],
  ["bastion-tide", "Bastion Tide", "Shooters", "1f7b927b39306bb1d7e2bac0d394577636ee5ed3db56b1d9d82c5036adf64f53"],
  ["iron-rampart", "Iron Rampart", "Strategy", "d7ecb4308034088ad33f31c99dc82f6589253cc13600359ee496d9f70b9f9ce5"],
  ["gemlode-quarry", "Gemlode Quarry", "Strategy", "268126dd010f8339f604afc15a20b8b12229ccdf19ba79e75e59a561837583b7"],
  ["sushi-cats", "Sushi Cats", "Strategy", "bab89bd985740c7fbd05a6baff927140afe3e0ddfbd09f75eb29981c3a295d3f"],
  ["dough-bros", "Dough Bros", "Simulation", "167d44cef5ac156b78f25bc05f3abf8c85afdda98cdd56b0b9fbb0b4893ec878"],
  ["orbit-pantry", "Orbit Pantry", "Strategy", "a7c69e6ccacae01b71f1c199ab3dbab4e865012fad16656d407ec3a7e35af199"],
  ["snowbound-haven", "Snowbound Haven", "Adventure", "575db39f9084d296a84cf315c0331b3b783d5be8bba584b4555a6f6b0ecb0d0d"],
  ["saddle-swap", "Saddle Swap", "Runners", "88f92e3a2a4f212d95ac4a5060305bb13c36d0313088e2082b9fad3cf527ff4f"],
  ["spire-breaker", "Spire Breaker", "Adventure", "ff3403b9ca84d0b8eecddc185f8663171967b358b4e2bb55caf454dccb9f11fd"],
  ["marble-dozer", "Marble Dozer", "Puzzles", "f693fd7e0adeb37845c9a38359638a39fcffb27eed5ef720c218e29711688776"],
];

export const PLAYABLE_GAMES: PlayableGame[] = GAMES.map(([id, title, category, hash, preview]) => ({
  id,
  title,
  category,
  image: imageUrl(hash, 1920),
  srcSet: [384, 640, 1280, 1920].map(width => `${imageUrl(hash, width)} ${width}w`).join(", "),
  previewVideo: preview && MEDIA + preview,
  ...(id === "pixel-legion" ? {
    presetId: "0a0d32af-8464-4b33-a8d3-93881eb8feae",
    dimension: "2D" as const,
    prompt: "Create a casual 2D pixel-art mobile crowd runner in 16-bit SNES style, playable in portrait and landscape. You lead a growing legion of tiny soldiers down a meadow road, dragging left and right to steer through gates that add, multiply, subtract or divide your army,",
    promptComplete: false,
  } : {}),
}));

export const HERO_VIDEO = "https://static.higgsfield.ai/playable-ads/hero/cliffs-2026-10-23/hero-original.mp4";
export const HERO_POSTER = "https://static.higgsfield.ai/playable-ads/hero/cliffs-2026-10-23/hero-poster.webp";
export const COMPOSER_DIVIDER = "https://static.higgsfield.ai/what-if/studio-v2/composer-divider-line.svg";
export const CONNECT_URL = "https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Higgsfield&connectorUrl=https%3A%2F%2Fmcp.higgsfield.ai%2Fmcp";
