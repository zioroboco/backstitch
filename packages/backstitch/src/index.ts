import { asCustomElement, PROPS_ATTRIBUTE } from "./custom-element"

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
    customElements.define(elementName, asCustomElement(component))
  })
