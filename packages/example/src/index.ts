import { createElement } from "react"
import { render } from "react-dom"

const root = document.createElement("div")
root.id = "root"

document.body.appendChild(root)

render(createElement("div", {}), root)
