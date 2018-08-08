import babel from "rollup-plugin-babel";
import pkg from "./package.json";

const input = "./src/sidebar.js";

const external = id => !id.startsWith("/") && !id.startsWith(".");

const getBabelOptions = () => ({
  runtimeHelpers: true,
  plugins: ["@babel/transform-runtime"]
});

export default [
  {
    input,
    output: { file: pkg.main, format: "cjs" },
    external,
    plugins: [babel(getBabelOptions())]
  },

  {
    input,
    output: { file: pkg.module, format: "es" },
    external,
    plugins: [babel(getBabelOptions())]
  }
];
