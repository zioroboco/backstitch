import { Configuration } from "webpack"
import * as HtmlWebpackPlugin from "html-webpack-plugin"
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import { join } from "path"

const { name } = require("./package.json")

const config: Configuration = {
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /.tsx?/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-typescript"] }
        }
      }
    ]
  },
  resolve: {
    plugins: [
      new TsConfigPathsPlugin({
        configFile: join(__dirname, "../../tsconfig.json")
      })
    ],
    extensions: [".json", ".js", ".ts"]
  },
  plugins: [new HtmlWebpackPlugin({ title: name })]
}

export default config
