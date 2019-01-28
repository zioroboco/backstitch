import { asCustomElement, PROPS_ATTRIBUTE } from "./custom-element"

export const props = (props: object) => ({
  [PROPS_ATTRIBUTE]: JSON.stringify(props)
})

interface BackstitchDefine {
  (entries: { elementName: string; component: React.ReactNode }[]): void
}

interface BackstitchDefine {
  (elementName: string, component: React.ReactNode): void
}

export const define: BackstitchDefine = (...args: any[]) => {
  if (Array.isArray(args[0])) {
    const definitions = args[0] as {
      elementName: string
      component: React.ReactNode
    }[]
    definitions.forEach(({ elementName, component }) =>
      customElements.define(elementName, asCustomElement(component))
    )
  } else {
    const [elementName, component] = args as [string, React.ReactNode]
    customElements.define(elementName, asCustomElement(component))
  }
}

export { PROPS_ATTRIBUTE }
