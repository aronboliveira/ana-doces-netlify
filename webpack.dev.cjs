const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  mode: "development",
  entry: "./dist/index.js", //ATIVADO POR SCRIPT GLOBAL
  // entry: "./dist/routing/IndexAnaDocesApp.js",
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "./"),
    },
  },
  module: {
    rules: [
      {
        test: [/\.js?$/, /\.ts?$/, /\.tsx?$/, /\.jsx?$/],
        use: [
          "ts-loader",
          {
            loader: "string-replace-loader",
            options: {
              search: /from\s+(['"])(\.\/[a-zA-Z]+)\1;/g,
              replace: 'from $1$2.js"',
            },
          },
        ],
        exclude: [/node_modules/, /types/],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      "@glSrc": path.resolve(__dirname, "../global/src/"),
    },
  },
  optimization: {
    minimize: true,
    usedExports: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  plugins: [
    // new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
  watch: true,
  output: {
    filename: "bundle_dev.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
};
