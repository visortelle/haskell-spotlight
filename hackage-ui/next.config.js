/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/hackage/:path*",
        destination: "https://hackage.haskell.org/:path*",
      },
      {
        source: "/api/hoogle/:path*",
        destination: "https://hoogle.haskell.org/:path*",
      },
    ];
  },
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true
  }
};
