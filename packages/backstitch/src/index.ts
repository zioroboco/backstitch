import { makeBridgeComponent } from "./bridge-component"
import { makeCustomElement, PROPS_ATTRIBUTE } from "./custom-element"

export const props = (props: object) => ({
  [PROPS_ATTRIBUTE]: JSON.stringify(props)
})

export const use = (
  entries: {
    component: React.ReactNode
    as: string
  }[]
) =>
  entries.forEach(({ component, as: elementName }) => {
    customElements.define(
      elementName,
      makeCustomElement(makeBridgeComponent(component))
    )
  })
