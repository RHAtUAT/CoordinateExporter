const path = require("path")
const fs = require("fs")

// -- Webpack configuration --

const config = {}

config.entry = "./dist/main.js"
config.target = "node"

// Node module dependencies should not be bundled
config.externals = fs.readdirSync("node_modules")
  .reduce(function(acc, mod) {
    if (mod === ".bin") {
      return acc
    }

    acc[mod] = "commonjs " + mod
    return acc
  }, {});

config.node = {
  console: false,
  global: false,
  process: false,
  Buffer: false,
  __filename: false,
  __dirname: false,
};

config.output = {
  path: path.join(__dirname, "dist"),
  filename: "bundle.js",
};

config.resolve = {
  extensions: [
    ".js",
    ".json",
  ],
}

module.exports = config
