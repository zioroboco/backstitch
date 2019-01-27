import * as React from "react"
import * as ReactDom from "react-dom"
import * as backstitch from "backstitch"

const root = document.createElement("div")
root.id = "root"

document.body.appendChild(root)

const CustomButton = (props: { label: string }) =>
  React.createElement("button", { style: { fontSize: "2em" } }, props.label)

backstitch.use([{ component: CustomButton, as: "x-button" }])

ReactDom.render(
  React.createElement("x-button", {
    onClick: () => console.log("woot!"),
    ...backstitch.props({ label: "doop!" })
  }),
  root
)
