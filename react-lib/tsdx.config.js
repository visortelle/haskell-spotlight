const postcss = require("rollup-plugin-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const stringPlugin = require("rollup-plugin-string");

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      stringPlugin.string({
        include: "**/*.svg"
      })
    );
    config.plugins.push(
      postcss({
        plugins: [
          autoprefixer(),
          cssnano({
            preset: "default"
          })
        ],
        inject: true
      })
    );
    return config;
  }
};
