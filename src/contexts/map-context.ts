import mapboxgl, { LngLatBounds } from "mapbox-gl"
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher"
import React from "react"
import { CentreGeoJsonProperties, GeoJSONLookup } from "../utils/map-types"
import type MapboxGeocoderType from "@mapbox/mapbox-gl-geocoder"

mapboxgl.accessToken = `pk.eyJ1IjoidGVhbWNob25nIiwiYSI6ImNrZmdrMHBpODA5NDUyeXAzYTl3NG82bWkifQ.BlmusYyrbemUzhPkK7oO3g`

type MapTypes = {
   map: mapboxgl.Map
   navigation: mapboxgl.NavigationControl
   geolocate: mapboxgl.GeolocateControl
   styleSwitcher: MapboxStyleSwitcherControl
   geocoder: MapboxGeocoderType
   fullscreen: mapboxgl.FullscreenControl
}

type MapState = MapTypes & {
   lng: number
   lat: number
   bounds: mapboxgl.LngLatBounds | null
   zoom: number | null
   renderedFeatures: Array<mapboxgl.MapboxGeoJSONFeature> | null
   renderedCentres: Array<GeoJSON.Feature<GeoJSON.Point, CentreGeoJsonProperties>> | null
   centreGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties> | null
   centreGeoJSONLookup: GeoJSONLookup | null
   regionGeoJSONLookup: GeoJSONLookup | null
   cityGeoJSONLookup: GeoJSONLookup | null
   moveTo: string | null
   lastToggleTriggerTime: number | null
   videoId: string | null
}

type MapMountAction = {
   type: `MOUNT`
   payload: {
      map: mapboxgl.Map
      navigation: mapboxgl.NavigationControl
      geolocate: mapboxgl.GeolocateControl
      styleSwitcher: MapboxStyleSwitcherControl
      geocoder: MapboxGeocoderType
      fullscreen: mapboxgl.FullscreenControl
      bounds: mapboxgl.LngLatBounds
      zoom: number
      renderedFeatures: Array<mapboxgl.MapboxGeoJSONFeature>
      // centreMarkerLookup: CentreMarkerLookup,
      // cityMarkerLookup: CityMarkerLookup,
   }
}

type MapMovingAction = {
   type: `MOVING`
   payload: {
      bounds: LngLatBounds
      zoom: number
      renderedFeatures: Array<mapboxgl.MapboxGeoJSONFeature>
   }
}

type MapMoveAction = {
   type: `MOVE`
   payload: string
}

type MapRandomVideoAction = {
   type: `RANDOM_VIDEO`
}

type MapAction = MapMountAction | MapMovingAction | MapMoveAction | MapRandomVideoAction

function mapReducer(state: MapState, action: MapAction): MapState {
   switch (action.type) {
      case `MOUNT`: {
         return Object.assign({}, state, {
            ...action.payload,
            renderedCentres: getRenderedCentres(action.payload.renderedFeatures, state.centreGeoJSONLookup),
         })
      }
      case `MOVING`: {
         try {
            if (state.map) {
               return Object.assign({}, state, {
                  bounds: action.payload.bounds,
                  zoom: action.payload.zoom,
                  renderedFeatures: action.payload.renderedFeatures,
                  renderedCentres: getRenderedCentres(action.payload.renderedFeatures, state.centreGeoJSONLookup),
               })
            }
         } catch (error) {}
         return state
      }
      case `MOVE`: {
         // console.log({ moveTo: state.moveTo, payload: action.payload })
         if (state.moveTo !== action.payload) {
            return Object.assign({}, state, { moveTo: action.payload })
         }
         return state
      }
      case `RANDOM_VIDEO`: {
         return Object.assign({}, state, { videoId: getRandomVideoId() })
      }
      default: {
         throw new Error()
      }
   }
}

function getRenderedCentres(renderedFeatures: Array<mapboxgl.MapboxGeoJSONFeature>, centreGeoJSONLookup: GeoJSONLookup) {
   return Object.values(
      renderedFeatures.reduce<{ [key: string]: GeoJSON.Feature<GeoJSON.Point, CentreGeoJsonProperties> }>((centres, feature) => {
         if (feature.properties.id) {
            const key = feature.properties.id.toLowerCase()
            centres[key] = centreGeoJSONLookup[key].features[0]
         } else {
            feature.properties.ids.split(/\n/g).forEach(id => {
               const key = id.toLowerCase()
               centres[key] = centreGeoJSONLookup[key].features[0]
            })
         }
         return centres
      }, {})
   )
}

type ContextType = {
   state: MapState
   dispatch: (action: MapAction) => void
}

function getRandomVideoId() {
   const videoIds = [
      `87IwDNXnOaI`,
      `giqz54UFn_g`,
      `RAOgvOoxh3E`,
      `0X6BiO2HfG4`,
      `Prai-nn3C6k`,
      `hW-l0I2mLcc`,
      `2iVtVlEV0Rc`,
      `hHXoDqBUtqE`,
      `2cyeCJuRgMg`,
      `Y0H36DN091k`,
      `5bHA2J4bEw8`,
      `35oxkL2Otx0`,
      `Aj3t06Xly-o`,
   ]
   return videoIds[~~(Math.random() * videoIds.length)]
}

const initMapState: MapState = {
   lng: 0,
   lat: 0,
   map: null,
   navigation: null,
   geolocate: null,
   styleSwitcher: null,
   geocoder: null,
   fullscreen: null,
   bounds: null,
   zoom: null,
   renderedFeatures: null,
   renderedCentres: null,
   centreGeoJSON: null,
   centreGeoJSONLookup: null,
   regionGeoJSONLookup: null,
   cityGeoJSONLookup: null,
   moveTo: null,
   lastToggleTriggerTime: null,
   videoId: getRandomVideoId(),
}
const MapContext = React.createContext<ContextType>({
   state: initMapState,
   dispatch: (action: MapAction) => {},
})

export { MapState, MapTypes, MapAction, mapReducer, initMapState, MapContext }
