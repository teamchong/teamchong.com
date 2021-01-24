import React from "react"
import { number } from "yargs"
import { CentreGeoJsonProperties } from "../utils/map-types"

type FeaturebarState = {
   collapsed: boolean
   selected: Array<GeoJSON.Feature<GeoJSON.Point, CentreGeoJsonProperties>>
   next: number
   nextTimeout: number
   highlighted: string | null
   lastToggleTime?: number
}
type FeaturebarExpandAction = {
   type: `EXPAND`
   payload: Array<GeoJSON.Feature<GeoJSON.Point, CentreGeoJsonProperties>>
}
type FeaturebarAutoplayAction = {
   type: `AUTOPLAY`
}
type FeaturebarCollapseAction = {
   type: `COLLAPSE`
}
type FeaturebarSelectAction = {
   type: `SELECT`
   payload: Array<GeoJSON.Feature<GeoJSON.Point, CentreGeoJsonProperties>>
}
type FeaturebarNextAction = {
   type: `NEXT`
   payload: number
}
type FeaturebarHighlightAction = {
   type: `HIGHLIGHT`
   payload: string | null,
}
type FeaturebarAction =
   | FeaturebarExpandAction
   | FeaturebarAutoplayAction
   | FeaturebarCollapseAction
   | FeaturebarSelectAction
   | FeaturebarNextAction
   | FeaturebarHighlightAction

const DELAY = 10000

function featurebarReducer(state: FeaturebarState, action: FeaturebarAction): FeaturebarState {
   switch (action.type) {
      case `EXPAND`: {
         clearTimeout(state.nextTimeout)
         const lastToggleTime = new Date().getTime()
         if ((state.collapsed || action.payload !== state.selected) && (!state.lastToggleTime || state.lastToggleTime + 1000 <= lastToggleTime)) {
            return Object.assign({}, state, {
               collapsed: false,
               lastToggleTime,
               selected: action.payload,
               highlighted: action.payload[0]?.properties?.id?.toLowerCase() ?? null,
               next: DELAY,
               nextTimeout: 0,
            })
         }
         return state
      }
      case `AUTOPLAY`: {
         clearTimeout(state.nextTimeout)
         return Object.assign({}, state, { next: DELAY })
      }
      case `COLLAPSE`: {
         clearTimeout(state.nextTimeout)
         const lastToggleTime = new Date().getTime()
         if (!state.collapsed && (!state.lastToggleTime || state.lastToggleTime + 1000 <= lastToggleTime)) {
            return Object.assign({}, state, { collapsed: true, selected: [], lastToggleTime, next: 0 })
         }
         return state
      }
      case `SELECT`: {
         clearTimeout(state.nextTimeout)
         return Object.assign({}, state, { highlighted: action.payload, next: DELAY, nextTimeout: 0 })
      }
      case `NEXT`: {
         if (state.nextTimeout !== action.payload) {
            clearTimeout(state.nextTimeout)
            return Object.assign({}, state, { nextTimeout: action.payload })
         }
         return state
      }
      case `HIGHLIGHT`: {
         clearTimeout(state.nextTimeout)
         if (state.highlighted !== action.payload) {
            // console.log({ highlighted: action.payload })
            return Object.assign({}, state, { highlighted: action.payload, next: 0, nextTimeout: 0 })
         }
         return state
      }
      default: {
         throw new Error()
      }
   }
}

type ContextType = {
   state: FeaturebarState
   dispatch: (action: FeaturebarAction) => void
}

const initFeaturebarState: FeaturebarState = {
   collapsed: true,
   selected: [],
   next: 0,
   nextTimeout: 0,
   highlighted: null,
   lastToggleTime: null,
}
const FeaturebarContext = React.createContext<ContextType>({
   state: initFeaturebarState,
   dispatch: (action: FeaturebarAction) => {},
})

export { FeaturebarState, FeaturebarAction, featurebarReducer, FeaturebarContext }
