/** @type {import('next').NextConfig} */
module.exports = {
  // Keep production builds separate when the development server is running.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};
