import * as React from "react"
import * as ReactDom from "react-dom"

import { BridgeComponentClass } from "./bridge-component"

export const PROPS_ATTRIBUTE = "data-props"

const getData = (root: Element) => {
  const attributeData = root.getAttribute(PROPS_ATTRIBUTE)
  if (!attributeData) return
  return JSON.parse(attributeData)
}

export const makeCustomElement = (bridgeComponent: BridgeComponentClass) =>
  class CustomElement extends HTMLElement {
    customElement: Element | null
    bridgeMountPoint: Element
    bridgeComponent: BridgeComponentClass
    mutationObserver: MutationObserver
    ref: any
    constructor() {
      super()
      this.customElement = null
      this.bridgeMountPoint = document.createElement("span")
      this.bridgeComponent = bridgeComponent
      this.ref = null
      this.mutationObserver = new MutationObserver(mutations =>
        mutations.forEach(m => {
          if (m.attributeName !== PROPS_ATTRIBUTE) return
          this.ref.update(getData(this.customElement!))
        })
      )
    }
    connectedCallback() {
      this.attachShadow({ mode: "open" }).appendChild(this.bridgeMountPoint)
      this.customElement = (this.bridgeMountPoint.parentNode as ShadowRoot).host
      ReactDom.render(
        React.createElement(this.bridgeComponent, {
          init: getData(this.customElement),
          ref: r => (this.ref = r)
        }),
        this.bridgeMountPoint
      )
      this.mutationObserver.observe(this.customElement, {
        attributes: true
      })
    }
  }
