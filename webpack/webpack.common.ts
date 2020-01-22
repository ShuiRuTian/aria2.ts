import path from "path";
import webpack from "webpack";

const baseConfig: webpack.Configuration = {
  entry: "./src/index.ts",
  /** Choose a style of source mapping to enhance the debugging process.
   * These values can affect build and rebuild speed dramatically. */
  // devtool: Options.Devtool,
  output: {
    path: path.resolve("./", "dist"),
    filename: "foo.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
  },
  resolve: {
    /** * A list of file extensions to try when requesting files.
     * * An empty string is considered invalid. */
    // For example, there are A.js, B.js and B.ts in the same folder.
    // In A.js, I import './B',
    // it will try to find B.tsx(not find), B.ts(find!), B.js(ignored), B.json(ignored).
    extensions: [".tsx", ".ts", ".js", "json"],
  },
  /** Include polyfills or mocks for various node stuff */
  node: {
    // for target 'web', we don't need fs and this cause some package error when build.
    fs: "empty",
  },
  target: "web",
  /** Add additional plugins to the compiler. */
  plugins: [],
  /** Stats options for logging  */
  // stats?: Options.Stats,
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },

};
export default baseConfig;
