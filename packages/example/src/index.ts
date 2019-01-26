import "@webcomponents/webcomponentsjs/custom-elements-es5-adapter"

import * as React from "react"
import * as ReactDom from "react-dom"

const root = document.createElement("div")
root.id = "root"

document.body.appendChild(root)

const mutationCallback: MutationCallback = mutations => {
  mutations.forEach(mutation => {
    console.log(mutation)
  })
}

const makeCustomElement = (component: string) =>
  class extends HTMLElement {
    node: HTMLDivElement
    ref: any
    component: string
    observer: MutationObserver
    constructor() {
      super()
      this.node = document.createElement("div")
      this.ref = undefined
      this.component = component
      this.observer = new MutationObserver(mutationCallback)
      this.observer.observe(this.node, { attributes: true })
    }
    connectedCallback() {
      this.attachShadow({ mode: "open" }).appendChild(this.node)
      ReactDom.render(
        React.createElement(this.component, {
          ref: (r: any) => (this.ref = r)
        }),
        this.node
      )
    }
  }

const CustomElement = makeCustomElement("span")

customElements.define("x-element", CustomElement)

ReactDom.render(React.createElement("x-element"), root)
