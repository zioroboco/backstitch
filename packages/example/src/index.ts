import * as React from "react"
import * as ReactDom from "react-dom"
import * as backstitch from "backstitch"

const root = document.createElement("div")
root.id = "root"

document.body.appendChild(root)

const CustomButton = (props: { children: React.ReactNode; size: string }) =>
  React.createElement(
    "button",
    { style: { fontSize: props.size } },
    props.children
  )

backstitch.use([{ component: CustomButton, as: "x-button" }])

ReactDom.render(
  React.createElement(
    "x-button",
    {
      onClick: () => console.log("woot!"),
      ...backstitch.props({ size: "2em" })
    },
    "doop!"
  ),
  root
)
