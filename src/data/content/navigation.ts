import { mcpMenuGroups } from "./mcp-navigation";
import { audioMenuGroups } from "./audio-navigation";
import { videoMenuGroups } from "./video-navigation";
import { imageMenuGroups } from "./image-navigation";

export default {
  "topBar": {
    "items": [
      {
        "type": "discount",
        "text": "Get an additional discount on premium plans after signing up",
        "cta": "Get your discount",
        "href": "/signup"
      },
      {
        "type": "seedance",
        "badge": "Special offer",
        "text": "Unlimited Seedance 2.5 at 720p for 30 days. Available on Scale plan with 30% OFF.",
        "cta": "Get Unlimited Seedance 2.5",
        "href": "/ai/video?model=seedance_2_5&resolution=1080p"
      }
    ]
  },
  "header": {
    "pricingDiscount": "30% OFF",
    "languages": [
      "English",
      "EspaÃ±ol",
      "FranÃ§ais",
      "Deutsch",
      "æ—¥æœ¬èªž"
    ]
  },
  "exploreOrder": [
    "promo",
    "influencerSection",
    "festival",
    "mcpSection",
    "effects",
    "genjutsuSection",
    "seedance25Section",
    "projects",
    "superSection",
    "gptImage2Section",
    "canvasSection",
    "marketingStudioSection",
    "seedance20Section",
    "differentScenesSameStarSection",
    "soulCinemaSection",
    "soul20Section",
    "tags"
  ],
  "nav": [
    {
      "label": "Explore",
      "href": "/",
      "active": true,
      "menu": [
        "Home"
      ]
    },
    {
      "label": "Image",
      "href": "/ai/image?model=soul-v2",
      "menu": { groups: imageMenuGroups }
    },
    {
      "label": "Video",
      "href": "/ai/video",
      "menu": { groups: videoMenuGroups }
    },
    {
      "label": "Audio",
      "href": "/audio",
      "menu": { groups: audioMenuGroups }
    },
    {
      "label": "MCP",
      "href": "/mcp",
      "menu": { groups: mcpMenuGroups }
    },
    {
      "label": "API",
      "href": "https://console.higgsfield.ai",
      "badge": "New"
    },
    {
      "label": "Genjutsu",
      "href": "/ai/video?model=genjutsu",
      "badge": "Top"
    },
    {
      "label": "Content Factory",
      "href": "/content-factory",
      "badge": "New"
    },
    {
      "label": "Playable",
      "href": "/playable",
      "badge": "New"
    },
    {
      "label": "AI Influencer",
      "href": "/ai-influencer-studio",
      "badge": "New"
    },
    {
      "label": "Academy",
      "href": "/academy",
      "badge": "New"
    },
    {
      "label": "Katana",
      "href": "/katana",
      "badge": "New"
    },
    {
      "label": "ChatGPT Plugin",
      "href": "/mcp?tab=chatgpt"
    },
    {
      "label": "Ads Studio",
      "href": "/ads-studio",
      "badge": "New"
    },
    {
      "label": "Effects",
      "href": "/effects/use"
    },
    {
      "label": "Cinema Studio",
      "href": "/generate"
    },
    {
      "label": "Contests",
      "href": "/contests/higgsfield-global-film-festival"
    },
    {
      "label": "Marketing Studio",
      "href": "/marketing-studio"
    },
    {
      "label": "Supercomputer",
      "href": "/supercomputer"
    },
    {
      "label": "3D Jutsu",
      "href": "/3d-jutsu",
      "badge": "New"
    },
    {
      "label": "Edit",
      "href": "/layers"
    },
    {
      "label": "Community",
      "href": "/community"
    },
    {
      "label": "Plugins",
      "href": "/plugins/after-effects"
    },
    {
      "label": "Canvas",
      "href": "/canvas"
    },
    {
      "label": "Originals",
      "href": "/original-series"
    }
  ]
};
