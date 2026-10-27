const soulAsset = (name: string) =>
  `https://static.higgsfield.ai/soul-v2/${name}.webp`;

export const soulExploreFeatures = [
  "Soul",
  "Soul Community",
  "Character",
  "AI Image Generator",
  "Nano Banana Pro Intro",
  "FLUX 2 Intro",
  "Seedream 5.0",
  "GPT 1.5",
  "Claude AI Image Generator",
  "Image Editing",
  "AI Influencer",
  "Skin Enhancer",
  "Style Snap",
  "Outfit Swap",
  "Outfit Shot",
  "Vending Machine",
  "Latex",
  "J Magazine",
  "J Poster",
  "AI Headshot Generator",
  "Mixed Media Intro",
  "UGC",
  "AI Avatar Generator",
  "Face Identity",
  "AI Stylist",
  "AI Video Generator",
  "Kling 3.0",
  "Seedance 2.0",
  "GPT 2",
  "Wan 2.6",
  "Grok Imagine",
];

export const soulHeroImages = Array.from({ length: 7 }, (_, i) =>
  soulAsset(`hero-${i + 1}`),
);

export const soulHighlights = [
  {
    title: "Soul ID Personalization.",
    text: "Your identity stays locked across every style, pose, and lighting.",
    href: "/character",
  },
  {
    title: "Built-in modern culture.",
    text: "Understands fashion terms, online slang, and cultural references.",
  },
  {
    title: "Soul HEX.",
    text: "Upload a reference image and let Soul HEX bring its colors into your own style.",
  },
  {
    title: "Soul Moodboard.",
    text: "Turn your references into a focused moodboard that defines style, tone, and creative direction.",
  },
  {
    title: "Feels real.",
    text: "Spontaneous poses, unexpected angles, authentic expressions.",
  },
  {
    title: "Creative Partner.",
    text: "Soul 2.0 interprets and pushes your vision further.",
  },
].map((item, i) => ({ ...item, image: soulAsset(`highlight-${i + 1}-v4`) }));

export const soulFeatureCards = [
  {
    title: "Text or image – your starting point",
    text: "Generate from a text prompt or use an image as a reference. Soul 2.0 interprets your input with the same level of realism and style control",
    image: soulAsset("grid-1"),
  },
  {
    title: "Editorial-level aesthetics",
    text: "Every output feels art-directed - with intentional composition, styling, and visual taste you'd expect from a magazine spread",
    image: soulAsset("grid-2"),
  },
  {
    title: "Unmatched Realism",
    text: "Soul 2.0 delivers natural textures and life-like authenticity to every visual story",
    image: soulAsset("grid-3"),
  },
  {
    title: "One click for instant aesthetic",
    text: "20+ curated presets at launch. Pick a vibe, type a prompt, and get magazine-ready results without prompt engineering",
    image: soulAsset("grid-4"),
  },
];

export const soulBentoImages = Array.from({ length: 7 }, (_, i) =>
  soulAsset(`bento-${i + 1}`),
);

export const soulUseCases = [
  [
    "UGC & Lifestyle",
    "Produce lifestyle content at scale without losing taste. Presets lock a consistent look, fast variations handle volume that are always-on social and perfect for drops and launches",
  ],
  [
    "Campaigns & Editorials",
    "Turn creative direction into polished campaign visuals. Soul is built for visual consistency across a full story to challenge real-life limitations",
  ],
  [
    "Personalization",
    "Create a consistent character with Soul ID once, then switch styles instantly. Cohesive portraits and photoshoots for social profiles, milestones, and personal branding",
  ],
  [
    "Music & Entertainment",
    "Create album artwork, promotional visuals, and artist personas. Match any genre from lo-fi to hyperpop to your unique vision",
  ],
  [
    "Social Media Ads",
    "Generate scroll-stopping ad creatives in bulk. Test multiple visual directions in minutes – different styles, settings, and compositions",
  ],
  [
    "Virtual Influencers & Avatars",
    "Build a consistent digital persona from scratch. Generate content across styles and settings while keeping identity locked with Soul ID",
  ],
].map(([title, text], i) => ({
  title,
  text,
  image: soulAsset(`case-${i + 1}`),
}));

export const soulPresets = [
  "Mystique city",
  "Warm ambient",
  "Editorial street style",
  "Subtle flash",
  "Old smartphone",
  "Frutiger Aero",
  "Swag era",
  "Y2K outside",
  "Nature light",
  "Y2K Studio",
  "Theatrical light",
  "Siren",
].map((title, i) => ({
  title,
  image: soulAsset(`library-${i < 6 ? 1 : 2}-${(i % 6) + 1}`),
}));

export const soulPlans = [
  { name: "Basic", price: "$9", credits: "120 credits/mo", accent: "#ffffff" },
  {
    name: "Pro",
    price: "$23",
    credits: "600 credits/mo",
    accent: "#d1fe17",
    badge: "21% OFF",
  },
  {
    name: "Max",
    price: "$59",
    credits: "1,800 credits/mo",
    accent: "#fe1678",
    badge: "MOST POPULAR",
  },
  {
    name: "Team",
    price: "$65",
    credits: "1,000 credits per seat/mo",
    accent: "#4384ff",
    badge: "BEST VALUE",
  },
];

export const soulFaq = [
  [
    "What is Higgsfield Soul?",
    "Soul is Higgsfield’s foundation image model built for creative, fashion-aware, culture-native generation. It produces realistic images with built-in aesthetic taste—designed to feel shot, not generated.",
  ],
  [
    "What is Soul ID?",
    "Soul ID lets you create a consistent digital character from your own photos. Train once, then generate visuals that keep your identity locked across every style, pose, and lighting setup.",
  ],
  [
    "How many photos do I need to train Soul ID?",
    "You need a minimum of 20 photos. Training takes about 3 minutes, and once complete, your Soul ID is ready for generations.",
  ],
  [
    "What are presets?",
    "Presets are curated aesthetic styles that instantly set the mood and visual direction of your generation.",
  ],
  [
    "Does Soul support different generation modes?",
    "Yes. Soul supports text-to-image generation and image reference.",
  ],
  [
    "Can I use Soul-generated images commercially?",
    "Yes. All generated images are available for commercial use.",
  ],
];

// Replace the existing `soulBlog` export in "@/data/soul" with this.
// Source: https://higgsfield.ai/soul-intro (blog carousel), titles/links/images from each post's page.
// Shape: [title, image, href]. `image` is "" when the post page exposes no cover image.

const sanity = (path: string) =>
  `https://cdn.sanity.io/images/s479xw3z/production/${path}`;

export const soulBlog = [
  [
    "How to Use Agentic AI for Content Creation",
    sanity("c296efe3ab3866b43d1beb561ce2d9b7c87b5613-3650x2053.png"),
    "https://higgsfield.ai/blog/agentic-ai-for-content-creation",
  ],
  [
    "Introducing the New AI Influencer: How It Works and What You Can Create",
    sanity("5e7bd50ae3ca46f0285ec26d60318449ecbde24d-2720x1530.png"),
    "https://higgsfield.ai/blog/new-ai-influencer",
  ],
  [
    "Inside Higgsfield #2: How We Built Supercomputer",
    sanity("401cfcd84886decd64cdb0a5642e63b93704e0b0-2688x1520.png"),
    "https://higgsfield.ai/blog/how-we-built-supercomputer",
  ],
  [
    "Inside Higgsfield #1: How We Built Cinema Studio",
    sanity("11354a98323ef0afe0ce38b239eff5c0656b5b59-1920x1080.webp"),
    "https://higgsfield.ai/blog/how-we-built-cinema-studio",
  ],
  [
    "Meet Cinema Studio 4.0: New Generation of AI Filmmaking",
    sanity("d4654a3b63a38a78a11689b592b36e78b9ea6b1a-1280x714.jpg"),
    "https://higgsfield.ai/blog/cinema-studio-4-0",
  ],
  [
    "Why Does Your AI Character's Face Keep Changing?",
    sanity("44fc38e74b189922b4ffb775dc896fd7e911429e-3238x1821.png"),
    "https://higgsfield.ai/blog/Why-Does-Your-AI-Characters-Face-Keep-Changing",
  ],
  [
    "Updates to Higgsfield's Terms of Use and Privacy Policy",
    "",
    "https://higgsfield.ai/blog/terms-of-use-privacy-policy-update",
  ],
  [
    "What's New in GenAI: AI Motion Design Meets CodeGen Video Generation",
    sanity("5ae09e409f6133b069347db095df1578ef94b90f-1408x736.png"),
    "https://higgsfield.ai/blog/AI-Motion-Design-When-Video-Generation-Meets-Code",
  ],
  [
    "Nano Banana 2 vs. Nano Banana 1: What Improvements to Expect?",
    "",
    "https://higgsfield.ai/blog/Nano-Banana-2-vs-Nano-Banana-1",
  ],
  [
    "How to Turn Sports Product Photos into AI Video Ads in 2026",
    sanity("745554a782b47f3220d953b8fabec060d63e4603-2720x1536.png"),
    "https://higgsfield.ai/blog/sports-product-video-ads-ai-2026",
  ],
] as const;

export const soulTestimonials = [
  {
    name: "Alexandre",
    initials: "A",
    text: "I've been using Higgsfield for my creative work for a while now and, honestly, it's one of the best platforms out there - the tools are powerful and the results speak for themselves. But what made me write this was the support. I had a question about my credits, and Tim handled everything with a transparency and care you rarely see.",
  },
  {
    name: "Spock",
    initials: "S",
    text: "Im a new customer of Higgsfield and enjoying it! I'm making some cool videos. I look forward to the advances on the platform! Oh, the support service is excellent!",
  },
  {
    name: "Rha",
    initials: "R",
    text: "Higgsfield A.I. has been the best and most exciting tool I've used since I first started editing back in 2008! I still can't believe we live in a time where we can type a sentence; prompt, on one end and get a blockbuster video that comes out on the other end! The site can feel overwhelming at times, but in a good way.",
  },
  {
    name: "Akun Suliman",
    initials: "AS",
    text: "I am an Indonesian content creator based on my experience, I feel helped by the presence of this AI Agent higgsfield I say honestly and swear also thank you.. Because AI Agent Higgsfield has helped a lot, especially for creators in the form of our full support to create. In addition to this support, there are many other supports that are very helpful, especially the Higgsfield team",
  },
  {
    name: "Shatanu Jachak",
    initials: "SJ",
    text: "What Higgsfield is doing really well is making high-quality AI creation feel smooth, fast, and inspiring. I also appreciate how the company supports its creative community and gives artists the freedom to experiment, grow, and push visual storytelling to the next level.",
  },
  {
    name: "Freissy Mediaart",
    initials: "FM",
    text: "The user interface (UI) is highly intuitive and beginner-friendly. Additionally, the cloud rendering speed for generating both images and videos is exceptionally fast, and the AI tools menu is very well-organized. I have completed numerous projects using Higgsfield, and every single one of them turned out perfectly.",
  },
  {
    name: "Ls estúdios",
    initials: "LE",
    text: "For a long time, I have seen it as a useful and well-optimized tool, designed to help creators in the best possible way. I like that it constantly introduces updates and interesting features that improve the experience. That is why it has always been a platform that has caught my attention and that I have enjoyed using compared to others.",
  },
  {
    name: "Rian Rizky Ananta",
    initials: "RR",
    text: "Honestly one of the best AI creative platforms out there. The credit pricing is surprisingly affordable compared to similar platforms, and what impresses me most is how consistently they keep shipping new features. You can tell the team actually listens and keeps pushing the product forward.",
  },
  {
    name: "Deyo D",
    initials: "DD",
    text: "The Most Powerful AI Creative Platform for Creators. What impressed me the most is the level of support around the creator program. The team is helpful, professional, and always there when you need assistance or have questions. It really feels like they care about creators and want to help them grow.",
  },
];
