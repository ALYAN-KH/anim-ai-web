export type VideoPreset = { name: string; url: string; poster?: string };
export type VideoCrop = { x: number; y: number; width: number; height: number };
export type VideoSelection = VideoPreset & { start?: number; end?: number; crop?: VideoCrop };

// Video sources and matching posters extracted from the original preset picker.
export const videoPresets: readonly VideoPreset[] = [
  {
    "name": "Influencer Motion 15",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/cd2aa00b5f6670c26711b9771433cb4b520cdc82acb0fce1206a1d8a51387391",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/b732a945d46b7d12cfc2f84cbc3edd2c474b61766559f2fca51cc136df8a536a"
  },
  {
    "name": "Influencer Motion 26",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/f458be14c1e4c115aa2d2a10c52baa0f9a5a4b5be49f1e40469ebd042617a1f7",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/09d31752e2f7915334e082655c12c91ae312c06ce243178fbd1c7a1ec3e15436"
  },
  {
    "name": "Influencer Motion 34",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/438d2053fa1086c994b64c7b36761637cd55d9ab82de77de8b76c286e4069191",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/0e103a90ff725706f7dedc288c837cdb79a33da1c4d3ca5e543e223f462db94f"
  },
  {
    "name": "Studio Dance Recast",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/8952d212a99883b0e8bfddd3cc43e81895bc1af39c1c1c6eafc7ee7b402cfcba",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/880cbb3410f3ea1f6732de8ed22b2cbd2c0a46476bbf9465672abe3b35b5c420"
  },
  {
    "name": "Courtyard Character",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/3352793705cdd5f8555d231e96d803e1e962fb525876595f2ff83881b0417029",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/658cef80d2b939d80fee9c9ecf4de1081f38aa54da21ae3998c9b5e25279de20"
  },
  {
    "name": "Green Suit",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/0aad749a5255772431b5371c6edc891852d0dc842522d1d0e8eaa3ef6e4201f6",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/c17177c1f0f1a97afc5ddbe1f82427bd0dbf34c1dcce2d156e71605e14f1a77d"
  },
  {
    "name": "Blond Character",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/440a4c6292671e1a674d4178dbd7cc933a35b066f74e4b84a580235cd0e619b0",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/361645acbf60361c3bb426ba414e97e5335b94cc85e12a02c54ba779fe94b048"
  },
  {
    "name": "Puffer Jacket",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/fc193d76849a41ec6c07cc6d0b17ebc5faa219ac13a9264059357287ed4ea617",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/64502b1c3560bd0538b09dc21762146c56443eca8a08aa39aa789ad995018ff3"
  },
  {
    "name": "Influencer Motion 07",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/73e0a2e34c3dc669619a9016ad8572bc5ca5bb8f4366000d1b0cafc95f1dae7c",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/1ff96edf27619d1f72a5308f859932f0da9ac6d6952e83398269da511725994d"
  },
  {
    "name": "Influencer Motion 11",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/17952c577c68a574333a7ba3a7817f2f1e431c396ece789eaa7297bab9091cb2",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/3d91a9720205d9f9abae7d2ba5c94d463b3793c4cb10ca56770b8922924f34c3"
  },
  {
    "name": "Influencer Motion 16",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/d0bcbe84607de8dc582c5ab1bdd5ab540e21636c8565dcdabe40c761c5abfa5b",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/c2382a92f1a60813bba25f53b0b02e825c7cee6fe05ac7164432941836ec4eb5"
  },
  {
    "name": "Influencer Motion 10",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/69ab3292fd28d1bef18525698e64d3d336aaea6f0860c3c95c6e48bbfc9cdbc5",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/76415213d5c6f8a1d8ca493c1c883c4ed46446ae82c8d499e7b2682d8de1b62f"
  },
  {
    "name": "Influencer Motion 17",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/2c17646f060ef03d797aebee97bb5993810c548e188f31370c45794ef82971db",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/77693fda551f7cb760000c6f7fd40dd1870a2030f2476eb99f97ddb113f20be0"
  },
  {
    "name": "Selfie Walk",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/8ac4b4c1f37b5ece96141c131b8700f91432ae4aff89c4883405fdbd2c575712.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/786820282e9e93596a495b74f7c5d8260cedd8a3629673aa67f231fcd87b0a54"
  },
  {
    "name": "Anime Times Square",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/04a4fe676c2e924934a962b73ca16aeb97b975c36358b4d6d7f3944d4297dfdd.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/76d5d7d6f7e3ec4b109b7ae8eee1f9d7d47c36f1724a9f08a154069bec8e1eeb"
  },
  {
    "name": "Countryside Duo",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/1cc5ecaa8930210d9c409984160a71c0747e470e398459002206f8c185ca9a84.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/c922f533fec6e8bc0157d3977cb507c673d3375837dbbc933879138421534409"
  },
  {
    "name": "Couple Recast",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/9679eedb0b154dde64dcfe65d60020a6a314c82dcdcbb43b8f1d690701356f20.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/3c1856193f71fa00fcb9b8e55c924fbdcefd27abecb6c18cb74a4a9ec0568335"
  },
  {
    "name": "Magenta Routine",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/25f3f5abc3e787b4b3d903c581da00bfb36c2d5574ca9151a81f508f0c00c7b2.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/608f4b7ebdbf84b877396b7178d07bfe0c00634bf10cf36f2d83b889cd545386"
  },
  {
    "name": "Orange Jacket",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/a3b5fcd545933d65753bf4128c67e5151d263e62a13e8085774787d60ae39f42.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/5290b9a56168049e196a4e6ca11115b1db36a8541830602d0561f1a4b3c01106"
  },
  {
    "name": "Clone Recast",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/bc2eb791a93b462c68cfb0681e3e007e3265053e66d0a8fb8a18cbdba5257171.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/e5afe7e63c0e164d11f4c0c871691e2653e888fc81ed56422af1a399f6dc405c"
  },
  {
    "name": "Umbrella Transformation",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/d7f9bb3fe068432b10d6eefa911e8d33698c17f667c31d48a67effe997a5eae8.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/8e7fef44593a5629e517aeb8d0b38112fdf841f0800b3ed64af357cf945ae4d7"
  },
  {
    "name": "Desert Duo",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/9b7051e510741d36e43d3e4021d640503ef8b9940cad2522970a155c87cef502.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/da0bc5b7862fb9aa87821d34f876ea365a504c79f9ee31713f20a7319811b36b"
  },
  {
    "name": "Handbag Slide",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/4eb27d7fbe76b0113db007c3dbc0877fcccc9849a1e6acb3707224958a07c3b0.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/4578313874e7e73a0da1fcbdb4f32ee8327881fc817a642b487b7e5c682c895c"
  },
  {
    "name": "Golden Gown",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/16c864812b50be3546803d03a256273d712d794ea9c869229dec4de518129ff8.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/b6eb698bc8ff990931d8bd970659bd5351435c6ea8da093a165efc920dc6abdd"
  },
  {
    "name": "Patchwork Runway",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/4aec8e751b0a4bb7de1f1a565c27d812f92e780be99c0be554af9b5a01d855a9.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/d32bab0a2653ebebff93dda2759aaa198c44b859d16b165ccf09042f1fbcf3b8"
  },
  {
    "name": "Pink Street Runway",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/e1ffc0b0b7f80802c82c21fb2668cf5ae9bd4e0e550405b3126ecb61249ec796.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/bff56ca89d34e4febd7f60a22794965bdb9dc192566bb2636729554543f575b7"
  },
  {
    "name": "Toronto Recast",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/b73df682dd91b5678c1715301d6fafa8c266f29f229843c58c75e82fb3968746.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/f5ea8118983c367abac044b9a2b1a4eb32a16e44c1a6b7c43adacf816882704a"
  },
  {
    "name": "Cat Performer",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/26af2744335c8f1cd8d9cb010168c32b80ff8f7da4c5bee89654a20c2e4da6d2.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/4be2cfc4ee6181ebe4f3698f4a5ab59b1e06caba0e6a896c820f0859b2829b2a"
  },
  {
    "name": "Playroom Recast",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/b00c5d8649303b6131a92718dd6d8a83e60b8d3253bfc886dc88dd1e85cb0876.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/6d831a7855a13f6cdd5100c3c755958c4a39e2e4f7508d300482d6efc9bd1371"
  },
  {
    "name": "Streetwear Recast",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/61e30b74715e9e6758361f187382de15681b9ccd617de885e2ac9101a5ea1a00.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/0d29a371b395de7bab593a4871bc0dde4ad9a17528f30b28c29b2005df81e3da"
  },
  {
    "name": "Urban Motion",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/21e6bcbae86eafd6b66ddd2e9979ad104f1ceb0e3378c5ab5885ba070971e315",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/dc7243157b14d247062e20d474e9cffa05158bc91993030bd5341b8b2c1597f9"
  },
  {
    "name": "Multi-Scene Recast",
    "url": "https://cdn.higgsfield.ai/higgsfield_multiplier_how_it_works_reference/fe10e23c-1cf1-4f57-9207-e21708bf5a80.mp4",
    "poster": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/3e3313c372ddc68e37abd3b688b5a044023919df9b96514db7743e0ae3e37268"
  }
];

export const communityVideoPresets: readonly VideoPreset[] = [
  {
    "name": "Influencer Motion 15",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/cd2aa00b5f6670c26711b9771433cb4b520cdc82acb0fce1206a1d8a51387391"
  },
  {
    "name": "Influencer Motion 17",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/2c17646f060ef03d797aebee97bb5993810c548e188f31370c45794ef82971db"
  },
  {
    "name": "Selfie Walk",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/publication-references/8ac4b4c1f37b5ece96141c131b8700f91432ae4aff89c4883405fdbd2c575712.mp4"
  },
  {
    "name": "Influencer Motion 34",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/438d2053fa1086c994b64c7b36761637cd55d9ab82de77de8b76c286e4069191"
  },
  {
    "name": "Studio Dance Recast",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/8952d212a99883b0e8bfddd3cc43e81895bc1af39c1c1c6eafc7ee7b402cfcba"
  },
  {
    "name": "Puffer Jacket",
    "url": "https://static-public-media.higgsfield.ai/ai-influencer-video-presets/published/fc193d76849a41ec6c07cc6d0b17ebc5faa219ac13a9264059357287ed4ea617"
  },
  {
    "name": "Tunnel Drift Swap",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/9e6c342d-4962-476f-9300-a603f2dd5396/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Soccer Character Swap",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/068eefc2-51be-434b-915a-20383a2cf989/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Cash Stack Flex",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/74db1b30-8fc0-4db2-86da-ca29995668cd/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Athlete Dance Swap",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/b02f5577-0c83-4190-84f4-7a83eaf83c21/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Studio Rap Performance",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/f3beb095-cf1e-4e49-995a-ba28b6032d63/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Elevator Mirror Selfie",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/804a5455-7756-4b4d-b6d6-937c60c831db/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Car Video Cast",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/1adb89f1-0242-4dc7-867b-12a9306ea12f/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Outdoor Energy Montage",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/1b751fb6-fc4f-4765-83e5-b2bc03ea0d47/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Face Swap",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/4d53c3b4-3e14-4bfb-87cd-969887140d75/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Suit Choir Groove",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/ab783827-2255-449e-933d-d049f45a99a1/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Truck Jump Reveal",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/c59cd944-73d0-4fa3-a4c4-ea2e051b8f6a/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Living Room Groove",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/390c35a1-59b9-4313-9eb5-fe47b644dd9e/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Talking Driver Swap",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/6ef611b0-155b-4f24-ba1f-74ca622ef024/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Canine Rhythm Swap",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/c04e66b1-48c4-46ba-8f05-07882c29b34e/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Festival Stage Swap",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/ae5e83bd-798a-4f09-96fb-f44de3c22f74/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Supercar Card Reveal",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/40fd0d7a-b12f-4eef-8d13-1f08ea2c2ba5/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Character Swap",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/5ab69310-441d-4ebd-baf4-a68a72a22f2b/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Party Dancer Swap",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/28c08d28-e2e0-4da8-88e3-89978a413014/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Survivor Field Memory",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/2f6a1c9d-3ad5-4b6a-a631-1870dec8d2b3/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Sunlit Garden Dance",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/29126d99-14c7-4c4c-aaf1-5c714b8dab63/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Court Recast",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/ec38b09d-cf0c-4605-80a6-9d31b58ec91d/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Roadside Celebration Swap",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/c03a6ea1-258e-4a53-ae1b-9a370a35e0fe/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Musician Duo Jam",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/1855e27b-c716-47e5-9e9f-6df6eb1d934d/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Cinematic Leading Man",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/c265c06f-a9fd-4364-8692-acee37350d79/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Miniature Car Transform",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/37942286-7fde-4d4c-a93d-dec9a6ad59c8/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Miniature Road Trip",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/de90452b-9574-46c1-b92c-dc6cd9762114/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Cliffside Hero Rescue",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/0b42363d-6e7d-4d1a-8879-cf38a22a7b0b/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Hotel Entrance Arrival",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/174ca154-ae32-4a5e-afe1-e0a0bb161b1c/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Toy Car Highway",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/24da76eb-7d36-416a-a57b-bab3d6e7522b/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Card Toss",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/9b598904-f5ad-46e9-a37b-8bfc71212723/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Red Carpet Recast",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/36ed5796-ef46-47cf-a787-64b590a8fcf1/generation-genjutsu-h264-600-v1.mp4"
  },
  {
    "name": "Star Power Trio",
    "url": "https://d8j0ntlcm91z4.cloudfront.net/community-presets/eaed1ba5-dd2f-4b75-8759-48325118dce4/generation-genjutsu-h264-600-v1.mp4"
  }
];
