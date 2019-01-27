import * as React from "react"
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
