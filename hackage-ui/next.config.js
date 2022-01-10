const isBuildWidgets = process.env.BUILD_WIDGETS;

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
  webpack: (config) => {
    if (isBuildWidgets) {
      return webpackBuildWidgets(config);
    }

    return {
      ...config,
    };
  },
};

function webpackBuildWidgets(config) {
  return {
    ...config,
    mode: "development",
    optimization: {},
    output: {
      ...config.output,
      // chunkFilename: '[name].js',
      chunkFormat: "commonjs",
    },
    entry: () => {
      return config.entry().then((entry) => {
        return {
          ...entry,
          SearchInputWidget: "./components/search/SearchInputWidget.tsx",
        };
      });
    },
  };
}
