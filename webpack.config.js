const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  entry: {
    index: "./example/src/index",
    responsive_example: "./example/src/responsive_example"
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "example/dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: isProd ? "static" : "disabled"
    })
  ],
  devServer: {
    contentBase: "./example"
  }
};
