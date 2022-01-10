import path from "path";
import { Configuration, ProvidePlugin } from "webpack";
import TerserPlugin from "terser-webpack-plugin";

export default ({
  mode,
}: {
  mode: "production" | "development";
}): Configuration => ({
  mode,
  entry: {
    background: path.resolve(__dirname, "./scripts/contentscript.ts"),
    contentscript: path.resolve(__dirname, "./scripts/contentscript.ts"),
    popup: path.resolve(__dirname, "./scripts/popup.ts"),
  },
  optimization: {
    minimize: mode === "production",
    minimizer:
      mode === "production"
        ? [
            new TerserPlugin({
              parallel: true,
              terserOptions: {
                // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
              },
            }),
          ]
        : [],
    moduleIds: "deterministic",
    usedExports: false,
  },
  plugins: [
    // Fix for:
    // BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
    // This is no longer the case. Verify if you need this module and configure a polyfill for it.
    new ProvidePlugin({
      process: "process/browser.js",
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  devtool: false,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: true,
                namedExport: true,
                localIdentName: "[local]--[hash:base64:5]",
              },
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "swc-loader",
          options: {
            // This makes swc-loader invoke swc synchronously.
            sync: true,
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname),
      build: path.resolve(__dirname, "./build"),
    },
    extensions: [".mjs", ".js", ".wasm", ".tsx", ".d.ts", ".ts", ".json"],
    fallback: {
      // Fix for:
      // BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
      // This is no longer the case. Verify if you need this module and configure a polyfill for it.
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: "buffer",
    },
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
  },
});
