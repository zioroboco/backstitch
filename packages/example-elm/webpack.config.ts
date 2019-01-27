import { Configuration } from "webpack"
import { makeConfig } from "backstitch-example/webpack.config"

const { name } = require("./package.json")

const config: Configuration = {
  ...makeConfig(name, [
    {
      test: /\.elm/,
      loader: "elm-webpack-loader"
    }
  ])
}

export default config
