import path from "path";
import { Configuration, ProvidePlugin } from "webpack";
import TerserPlugin from "terser-webpack-plugin";

export default ({
  mode
}: {
  mode: "production" | "development";
}): Configuration => ({
  mode,
  target: "webworker",
  entry: {
    webview: path.resolve(__dirname, "./src/webview.tsx"),
    extension: path.resolve(__dirname, "./src/extension.ts")
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
              }
            })
          ]
        : [],
    moduleIds: "deterministic",
    usedExports: false
  },
  plugins: [
    // Fix for:
    // BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
    // This is no longer the case. Verify if you need this module and configure a polyfill for it.
    new ProvidePlugin({
      process: "process/browser.js",
      Buffer: ["buffer", "Buffer"]
    })
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
              }
            }
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: true,
                namedExport: true,
                localIdentName: "[local]--[hash:base64:5]"
              }
            }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["postcss-safe-important", {}]]
              }
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "swc-loader",
          options: {
            // This makes swc-loader invoke swc synchronously.
            sync: true
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, ".", "node_modules", "react"),
      "react-dom": path.resolve(__dirname, ".", "node_modules", "react-dom"),
      src: path.resolve(__dirname),
      build: path.resolve(__dirname, "./build"),
      mainFields: ["browser", "module", "main"]
    },
    extensions: [".mjs", ".js", ".wasm", ".tsx", ".d.ts", ".ts", ".json"],
    fallback: {
      // Fix for:
      // BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
      // This is no longer the case. Verify if you need this module and configure a polyfill for it.
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: "buffer"
    }
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
    libraryTarget: "commonjs2"
  },
  externals: {
    vscode: "commonjs vscode" // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  }
});
