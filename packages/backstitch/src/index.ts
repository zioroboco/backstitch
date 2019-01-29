import { asCustomElement, PROPS_ATTRIBUTE } from "./custom-element"

export const props = (props: object) => ({
  [PROPS_ATTRIBUTE]: JSON.stringify(props)
})

export const define = (name: string, component: React.ReactNode) =>
  customElements.define(name, asCustomElement(component))

export { PROPS_ATTRIBUTE }
