import * as React from "react"
import * as backstitch from "backstitch"

const root = document.createElement("div")
root.id = "root"

document.body.appendChild(root)

const CustomButton = (props: {
  children: React.ReactNode
  size: string
  color: string
}) =>
  React.createElement(
    "button",
    { style: { fontSize: props.size, color: props.color } },
    props.children
  )

backstitch.define("x-button", CustomButton)

const { Elm } = require("./App.elm")

Elm.Main.init({
  node: document.getElementById("root")
})
