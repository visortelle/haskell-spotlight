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
          {
            loader: "style-loader",
            options: {
              injectType: "lazyStyleTag",
              insert: function insertIntoTarget(
                element: any,
                options: { target: any }
              ) {
                var parent = options.target || (global as any).document.head;
                parent.appendChild(element);
              },
            },
          },
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
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // Replace :root to :host as extension renders to shadow dom.
                    "postcss-selector-replace",
                    { before: [":root"], after: [":host"] },
                  ],
                  [
                    // Replace :root to :host as extension renders to shadow dom.
                    "postcss-rem-to-pixel",
                    {
                      rootValue: 1,
                      unitPrecision: 5,
                      propList: ["*", "border-radius"],
                      replace: true,
                      mediaQuery: true
                    },
                  ],
                ],
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
      react: path.resolve(__dirname, ".", "node_modules", "react"),
      "react-dom": path.resolve(__dirname, ".", "node_modules", "react-dom"),
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
