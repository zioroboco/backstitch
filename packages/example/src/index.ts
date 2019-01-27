import "@webcomponents/webcomponentsjs/custom-elements-es5-adapter"

import * as React from "react"
import * as ReactDom from "react-dom"

const root = document.createElement("div")
root.id = "root"

document.body.appendChild(root)

const ATTRIBUTE = "data-props"

// @ts-ignore
const getData = (root: ShadowRoot) => JSON.parse(root.getAttribute(ATTRIBUTE))

const makeCustomElement = (component: any) =>
  class extends HTMLElement {
    node: HTMLSpanElement
    root: ShadowRoot | null
    ref: any
    component: any
    mutationObserver: MutationObserver
    mutationCallback: MutationCallback
    constructor() {
      super()
      this.node = document.createElement("span")
      this.root = null
      this.ref = undefined
      this.component = component
      this.mutationCallback = mutations =>
        mutations.forEach(m => {
          if (m.attributeName !== ATTRIBUTE) return
          this.ref.update(getData(this.root!))
        })
      this.mutationObserver = new MutationObserver(this.mutationCallback)
    }
    connectedCallback() {
      this.attachShadow({ mode: "open" }).appendChild(this.node)
      // @ts-ignore
      this.root = this.node.parentNode.host as ShadowRoot
      ReactDom.render(
        React.createElement(this.component, {
          root: this.root,
          ref: r => (this.ref = r)
        }),
        this.node
      )
      this.mutationObserver.observe(this.root, {
        attributes: true
      })
    }
  }

type HostComponentProps = { ref: any; root: ShadowRoot }
const makeHostComponent = (component: any) =>
  class extends React.Component<HostComponentProps, object> {
    update: (data: object) => void
    constructor(props: any) {
      super(props)
      this.state = getData(props.root)
      this.update = (data: object) => {
        this.setState(data)
      }
    }
    render() {
      return React.createElement(component, this.state)
    }
  }

const props = (props: object) => ({ [ATTRIBUTE]: JSON.stringify(props) })

const use = (entries: [{ component: any; as: string }]) =>
  entries.forEach(({ component, as: element }) =>
    customElements.define(
      element,
      makeCustomElement(makeHostComponent(component))
    )
  )

const backstitch = { use, props }

const CustomButton = (props: { label: string }) =>
  React.createElement("button", { style: { "font-size": "2em" } }, props.label)

backstitch.use([{ component: CustomButton, as: "x-button" }])

ReactDom.render(
  React.createElement("x-button", {
    onClick: () => console.log("woot!"),
    ...backstitch.props({ label: "doop!" })
  }),
  root
)
