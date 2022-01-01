/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/hackage/:path*",
        destination: "https://hackage.haskell.org/:path*",
      },
    ];
  },
  reactStrictMode: true,
};
