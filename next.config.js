/** @type {import('next').NextConfig} */
module.exports = {
  // Keep production builds separate when the development server is running.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    return [
      {
        // Transcoded previews are content-addressed (see scripts/optimize-home-videos.mjs).
        source: "/media/home/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};
