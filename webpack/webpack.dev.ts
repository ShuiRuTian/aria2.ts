import webpack from "webpack";
import webpackMerge from "webpack-merge";
import baseConfig from "./webpack.common";

const devConfig: webpack.Configuration = webpackMerge(baseConfig, {
  mode: "development",
  devtool: "eval-source-map",
  /** Capture timing information for each module. */
  profile: true,
  /** Cache generated modules and chunks to improve performance for multiple incremental builds. */
  cache: true,
  optimization: {
    splitChunks: {
      name: true,
    },
  },

});

export default devConfig;
