# backstitch! 🧵 [![CircleCI](https://img.shields.io/circleci/project/github/zioroboco/backstitch/master.svg)](https://circleci.com/gh/zioroboco/backstitch/tree/master) [![npm latest version](https://img.shields.io/npm/v/backstitch/latest.svg)](https://www.npmjs.com/package/backstitch)

_To sew with overlapping stitches, to bind two pieces of fabric together._

`backstitch` allows you to wrap your [React](https://reactjs.org/) UI elements in a [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) custom elements API, and use them in places where it's otherwise tricky to embed React — e.g. in [Elm](https://elm-lang.org/)!

- [API](#api)
  - [`backstitch.define`](#backstitchdefine)
  - [`backstitch.props`](#backstitchprops)
  - [`backstitch.PROPS_ATTRIBUTE`](#backstitchprops_attribute)
- [React example](#react-example)
- [Elm example](#elm-example)
- [How it works (WIP)](#how-it-works-wip)
- [Limitations](#limitations)

## API

### `backstitch.define`

The `backstitch.define` function mimics the native `customElements.define` API:

```ts
backstitch.define("x-element", ReactComponent)
```

### `backstitch.props`

`backstitch.props` serialises plain-old-javascript props to a JSON string under the correct `data-props` object key, so that they can be directly passed to a `backstitch` custom element.

With the right cocktail of polyfills, this can be used to check custom elements against their original tests, e.g.:

```tsx
const container = render(
  React.createElement("x-element", backstitch.props(plainOldJavascriptProps))
)
```

### `backstitch.PROPS_ATTRIBUTE`

The name of the props `data-*` attribute (i.e. `"data-props"`).

## React example

```tsx
import * as backstitch from "backstitch"
import ReactButton from "./components/Button"

backstitch.define("x-button", ReactButton)

const ContrivedExample = props => (
  <x-button
    data-props=`{"size": "huge", "blink": ${props.isObnoxious}}`
    onClick={() => window.alert("Zap! Kapow!")}
  >
    Click Me!
  </x-button>
)
```

## Elm example

```tsx
import * as backstitch from "backstitch"
import ReactButton from "./components/Button"

backstitch.define("x-button", ReactButton)

const { Elm } = require("./App.elm")

Elm.Main.init({
  node: document.getElementById("root")
})
```

```elm
...

view : Model -> Html Msg
view model =
    let
        props =
            encode 0 <|
              object
                  [ ( "size", string "huge" )
                  , ( "blink" , bool model.isObnoxious )
                  ]
    in
    Html.node "x-button"
      [ attribute "data-props" props
      , onClick ZapKapow
      ]
      [ Html.text "Click Me!"
      ]
```

## How it works (WIP)

On creation, the custom element creates a shadow DOM containing a single `span` element. It renders a bridging React component into this element, which hosts the wrapped component and supplies its props.

The custom element listens for changes on its `data-props` attribute. When it detects a change, it passes the attribute data to the bridge component, instructing it to update its state with the new data.

React then takes over and decides whether any of the wrapped components' props are affected by the new state in the bridge component. If so, this triggers a rerender of the wrapped component.

For more detail, see: [./packages/backstitch/src/custom-element.ts](./packages/backstitch/src/custom-element.ts)

## Limitations

`backstitch` is only able to send props data which can be serialised to JSON. While in practice this covers many use cases, some React tricks such as passing event handlers or render functions as props will not work with custom elements.
