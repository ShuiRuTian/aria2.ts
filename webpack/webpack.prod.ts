import webpack from "webpack";
import webpackMerge from "webpack-merge";
import baseConfig from "./webpack.common";

const devConfig: webpack.Configuration = {
  mode: "development",
  optimization: {
    splitChunks: {
      name: false,
    },
  },

};

export default webpackMerge(baseConfig, devConfig);
