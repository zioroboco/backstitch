import * as React from "react"
import * as ReactDom from "react-dom"

/** The data-* attribute used to passed serialised props to components. */
export const PROPS_ATTRIBUTE = "data-props"

/** Deserialise and return props data from the passed element. */
const getData = (element: Element) => {
  const attributeData = element.getAttribute(PROPS_ATTRIBUTE)
  if (!attributeData) return
  return JSON.parse(attributeData)
}

/**
 * Wraps the passed bridge component in a custom element, which forwards
 * serialised data from its props data attribute to the wrapped component.
 *
 * @param bridgeComponent Component for forwarding updated props data.
 */
const makeCustomElement = (bridgeComponent: BridgeComponentClass) =>
  class CustomElement extends HTMLElement {
    /**
     * Watches the custom element node for target data attribute changes,
     * updating state on the bridge component via a callback.
     */
    mutationObserver: MutationObserver
    /** Ref to the bridge component, used to push state updates. */
    ref: any
    constructor() {
      super()
      this.ref = null
      this.mutationObserver = new MutationObserver(mutations =>
        mutations.forEach(m => {
          if (m.attributeName !== PROPS_ATTRIBUTE) return
          this.ref.update(getData(this))
        })
      )
    }
    connectedCallback() {
      // Attach a shadow DOM with a node for mounting the bridge component.
      const shadowRoot = this.attachShadow({ mode: "open" })
      const mountPoint = document.createElement("span")
      shadowRoot.appendChild(mountPoint)
      // Render the bridge component into the mount point node.
      ReactDom.render(
        // Initialise the bridge component with props from deserialised
        // attribute data, and return a ref for pushing updates.
        React.createElement(bridgeComponent, {
          init: getData(this),
          ref: r => (this.ref = r)
        }),
        mountPoint
      )
      // Begin watching for changes to the host custom element.
      this.mutationObserver.observe(this, {
        attributes: true
      })
    }
  }

type BridgeComponentProps = { init: object; ref: any }
type BridgeComponentState = object
type BridgeComponentClass = React.ComponentClass<
  BridgeComponentProps,
  BridgeComponentState
>

/**
 * Returns a component for hosting the passed target component. Returns an
 * update function via ref, which replaces the bridge component state with new
 * data returned from the custom element's props data attribute. React then
 * decides whether to update props and rerender the target component.
 *
 * @param targetComponent The child component to be passed props data.
 */
const makeBridgeComponent = (targetComponent: React.ReactNode) =>
  class BridgeComponent extends React.Component<
    BridgeComponentProps,
    BridgeComponentState
  > {
    /** When called via the ref, replaces state with the new props data. */
    update: (data: object) => void
    constructor(props: any) {
      super(props)
      // Initialise the bridge component with initial props attribute data.
      this.state = props.init
      this.update = (data: object) => {
        this.setState(data)
      }
    }
    render() {
      return React.createElement(
        // @ts-ignore -- requires a react component type excluding null, text etc.
        targetComponent,
        this.state,
        // Slot element for rendering children of the host custom element.
        React.createElement("slot")
      )
    }
  }

/** Wraps the passed component in a custom element API via a bridge component. */
export const asCustomElement = (component: React.ReactNode) =>
  makeCustomElement(makeBridgeComponent(component))
