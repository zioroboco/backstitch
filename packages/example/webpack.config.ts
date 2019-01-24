import { Configuration } from "webpack"
import * as HtmlWebpackPlugin from "html-webpack-plugin"

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
  resolve: { extensions: [".json", ".js", ".ts", ".tsx"] },
  plugins: [new HtmlWebpackPlugin({ title: name })]
}

export default config
