module Main exposing (Model, Msg(..), init, main, subscriptions, timeToString, update, view)

import Browser
import Html exposing (..)
import Html.Attributes exposing (attribute)
import Html.Events exposing (onClick)
import Json.Encode exposing (encode, object, string)
import Task
import Time



-- MAIN


main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { zone : Time.Zone
    , time : Time.Posix
    , pretty : Bool
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model Time.utc (Time.millisToPosix 0) False
    , Task.perform AdjustTimeZone Time.here
    )



-- UPDATE


type Msg
    = Tick Time.Posix
    | AdjustTimeZone Time.Zone
    | Toggle


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Toggle ->
            ( { model | pretty = not model.pretty }
            , Cmd.none
            )

        Tick newTime ->
            ( { model | time = newTime }
            , Cmd.none
            )

        AdjustTimeZone newZone ->
            ( { model | zone = newZone }
            , Cmd.none
            )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Time.every 1000 Tick



-- VIEW


view : Model -> Html Msg
view model =
    let
        hour =
            timeToString (Time.toHour model.zone model.time)

        minute =
            timeToString (Time.toMinute model.zone model.time)

        second =
            timeToString (Time.toSecond model.zone model.time)

        props =
            object
                [ ( "size", string "2em" )
                , ( "color"
                  , string
                        (if model.pretty then
                            "red"

                         else
                            "black"
                        )
                  )
                ]
    in
    case Time.posixToMillis model.time of
        0 ->
            div [] []

        time ->
            div []
                [ Html.node "x-button"
                    [ attribute "data-props" (encode 0 props)
                    , onClick Toggle
                    ]
                    [ Html.text (hour ++ ":" ++ minute ++ ":" ++ second)
                    ]
                ]


timeToString : Int -> String
timeToString int =
    String.padLeft 2 '0' (String.fromInt int)
