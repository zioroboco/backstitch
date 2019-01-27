import * as React from "react"

export type BridgeComponentProps = { init: object; ref: any }
export type BridgeComponentState = object
export type BridgeComponentClass = React.ComponentClass<
  BridgeComponentProps,
  BridgeComponentState
>

export const makeBridgeComponent = (targetComponent: React.ReactNode) =>
  class BridgeComponent extends React.Component<
    BridgeComponentProps,
    BridgeComponentState
  > {
    update: (data: object) => void
    constructor(props: any) {
      super(props)
      this.state = props.init
      this.update = (data: object) => {
        this.setState(data)
      }
    }
    render() {
      return React.createElement(
        // @ts-ignore
        targetComponent,
        this.state,
        React.createElement("slot")
      )
    }
  }
