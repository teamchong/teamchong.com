
import React from "react"
// import querystring from "querystring"

type WinState = {
   winWidth: number | null
   winHeight: number | null
   hash: {[key: string]: string | string[]}
}

type WinInitializeAction = {
   type: `INITIALIZE`
   payload: {
      winWidth: number
      winHeight: number
      hash: {[key: string]: string | string[]}
   }
}

type WinResizeAction = {
   type: `RESIZE`
   payload: { winWidth: number; winHeight: number }
}

// type WinHashChangeAction = {
//    type: `HASH_CHANGE`
//    payload: {[key: string]: string | string[]}
// }

type WinUpdateHashAction = {
   type: `UPDATE_HASH`
   payload: {[key: string]: string | string[]}
}

type WinAction =
   | WinInitializeAction
   | WinResizeAction
   // | WinHashChangeAction
   | WinUpdateHashAction

function winReducer(state: WinState, action: WinAction): WinState {
   switch (action.type) {
      case `INITIALIZE`: {
         return Object.assign({}, state, action.payload)
      }
      case `RESIZE`: {
         if (state.winWidth != action.payload.winWidth || state.winHeight != action.payload.winHeight) {
            return Object.assign({}, state, action.payload)
         }
         return state
      }
      // case `HASH_CHANGE`: {
      //    if (state.hash !== action.payload) {
      //       return Object.assign({}, state, { hash: action.payload })
      //    }
      //    return state
      // }
      case `UPDATE_HASH`: {
         const newHash = Object.assign({}, state.hash, action.payload)
         // window.location.hash = querystring.stringify(newHash)
         history.pushState(action.payload, action.payload.h as string, `/tec/${encodeURIComponent(action.payload.h)}`)
         console.log({newHash})
         return Object.assign({}, state, { hash: newHash })
      }
      default: {
         throw new Error()
      }
   }
}

type ContextType = {
   state: WinState
   dispatch: (action: WinAction) => void
}

const initWinState: WinState = {
   winWidth: null,
   winHeight: null,
   hash: {},
}

const WinContext = React.createContext<ContextType>({
   state: initWinState,
   dispatch: (action: WinAction) => {},
})

export {
   WinState,
   WinAction,
   winReducer,
   WinContext,
}
