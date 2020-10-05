import React from "react"
import { CentreGeoJsonProperties } from "../utils/map-types"

type FeaturebarState = {
   collapsed: boolean
   selected: Array<GeoJSON.Feature<GeoJSON.Point, CentreGeoJsonProperties>>
   highlighted: string | null
   lastToggleTime?: number
}
type FeaturebarExpandAction = {
   type: `EXPAND`
   payload: Array<GeoJSON.Feature<GeoJSON.Point, CentreGeoJsonProperties>>
}
type FeaturebarCollapseAction = {
   type: `COLLAPSE`
}
type FeaturebarSelectAction = {
   type: `SELECT`
   payload: Array<GeoJSON.Feature<GeoJSON.Point, CentreGeoJsonProperties>>
}
type FeaturebarUnselectAction = {
   type: `UNSELECT`
   payload: string
}
type FeaturebarHighlightAction = {
   type: `HIGHLIGHT`
   payload: string
}
type FeaturebarUnhighlightAction = {
   type: `UNHIGHLIGHT`
}
type FeaturebarAction =
   | FeaturebarExpandAction
   | FeaturebarCollapseAction
   | FeaturebarSelectAction
   | FeaturebarUnselectAction
   | FeaturebarHighlightAction
   | FeaturebarUnhighlightAction

function featurebarReducer(state: FeaturebarState, action: FeaturebarAction): FeaturebarState {
   switch (action.type) {
      case `EXPAND`: {
         const lastToggleTime = new Date().getTime()
         if ((state.collapsed || action.payload !== state.selected) && (!state.lastToggleTime || state.lastToggleTime + 1000 <= lastToggleTime)) {
            return Object.assign({}, state, {
               collapsed: false,
               lastToggleTime,
               selected: action.payload,
               highlighted: action.payload[0]?.properties?.code?.toLowerCase() ?? null,
            })
         }
         return state
      }
      case `COLLAPSE`: {
         const lastToggleTime = new Date().getTime()
         if (!state.collapsed && (!state.lastToggleTime || state.lastToggleTime + 1000 <= lastToggleTime)) {
            return Object.assign({}, state, { collapsed: true, selected: [], lastToggleTime })
         }
         return state
      }
      case `SELECT`: {
         if (state.selected !== action.payload) {
            return Object.assign({}, state, {
               selected: action.payload,
               highlighted: action.payload[0]?.properties?.code?.toLowerCase() ?? null,
            })
         }
         return state
      }
      case `UNSELECT`: {
         if (state.selected.length !== 0) {
            return Object.assign({}, state, { selected: [] })
         }
         return state
      }
      case `HIGHLIGHT`: {
         if (state.highlighted !== action.payload) {
            // console.log({ highlighted: action.payload })
            return Object.assign({}, state, { highlighted: action.payload })
         }
         return state
      }
      case `UNHIGHLIGHT`: {
         if (state.selected.length !== 0) {
            return Object.assign({}, state, { highlighted: null })
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
   highlighted: null,
   lastToggleTime: null,
}
const FeaturebarContext = React.createContext<ContextType>({
   state: initFeaturebarState,
   dispatch: (action: FeaturebarAction) => {},
})

export { FeaturebarState, FeaturebarAction, featurebarReducer, FeaturebarContext }
