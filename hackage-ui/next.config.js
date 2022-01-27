const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ["www.haskell.org"],
  },
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
  webpack: (_config) => {
    let config = fixMultipleReactInstancesIssue(_config);

    return {
      ...config,
    };
  },
};

// Fixes:
//
// Unhandled Runtime Error
// Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
// 1. You might have mismatching versions of React and the renderer (such as React DOM)
// 2. You might be breaking the Rules of Hooks
// 3. You might have more than one copy of React in the same app
// See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.
function fixMultipleReactInstancesIssue(config) {
  config.resolve.alias["react"] = path.resolve(
    __dirname,
    ".",
    "node_modules",
    "react"
  );
  config.resolve.alias["react-dom"] = path.resolve(
    __dirname,
    ".",
    "node_modules",
    "react-dom"
  );
  return config;
}
