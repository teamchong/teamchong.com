import React, { useRef } from "react"
import { MapState, MapContext, MapAction } from "../contexts/map-context"
import Featurebar from "./featurebar"
import Breadcrumb from "./breadcrumb"
import { getFitBoundsOptions } from "../utils/map-functions"
import { createMap } from "../utils/create-map"
import { CentreGeoJsonProperties, GeoJSONLookup } from "../utils/map-types"
import "mapbox-gl/dist/mapbox-gl.css"
import { LngLatBounds } from "mapbox-gl"
import { WinContext, WinAction } from "../contexts/win-context"

type Props = {
   children?: any
}

function refreshHref(
   bounds: LngLatBounds,
   renderedFeatures: Array<mapboxgl.MapboxGeoJSONFeature>,
   movingTo: string,
   href: string | null,
   winDispatch: (action: WinAction) => void
) {
   return () => {
      if (!bounds || movingTo) return
      let newHref: string = ``
      // let clusteredCount: number = 0
      let countriesCount: { [country: string]: number } = {}
      let citiesCount: { [city: string]: number } = {}
      let idsCount: { [id: string]: number } = {}
      for (const {
         properties: { countries, country, cities, city, ids, id },
      } of renderedFeatures) {
         // if (!id) clusteredCount++
         if (country) {
            countriesCount[country] = (countriesCount[country] ?? 0) + 1
         } else {
            countries?.split(/\n/g).forEach(c => {
               countriesCount[c] = (countriesCount[c] ?? 0) + 1
            })
         }
         if (city) {
            citiesCount[city] = (citiesCount[city] ?? 0) + 1
         } else {
            cities?.split(/\n/g).forEach(c => {
               citiesCount[c] = (citiesCount[c] ?? 0) + 1
            })
         }
         if (id) {
            idsCount[id] = (idsCount[id] ?? 0) + 1
         } else {
            ids?.split(/\n/g).forEach(c => {
               idsCount[c] = (idsCount[c] ?? 0) + 1
            })
         }
      }
      // console.log({ featureCount, clusteredCount, countriesCount, citiesCount, idsCount, renderedFeatures })
      if (Object.keys(idsCount).length === 1) {
         newHref = Object.keys(idsCount)[0].toLowerCase()
      } else if (Object.keys(citiesCount).length === 1) {
         newHref = Object.keys(citiesCount)[0].toLowerCase()
      } else if (Object.keys(countriesCount).length === 1) {
         newHref = Object.keys(countriesCount)[0].toLowerCase()
      } else if (Object.keys(idsCount).length === 1) {
         newHref = Object.keys(idsCount)[0].toLowerCase()
      }
      if ((href ?? ``) !== newHref) {
         winDispatch({ type: `UPDATE_HASH`, payload: { h: newHref } })
      }
   }
}

function moveMapTo(
   map: mapboxgl.Map,
   centreGeoJSONLookup: GeoJSONLookup,
   cityGeoJSONLookup: GeoJSONLookup,
   regionGeoJSONLookup: GeoJSONLookup,
   centreGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties>,
   moveTo: string,
   mapDispatch: (action: MapAction) => void
) {
   return () => {
      if (!map || !moveTo) return
      if (centreGeoJSONLookup[moveTo]) {
         const [x1, y1, x2, y2] = centreGeoJSONLookup[moveTo].bbox
         map.fitBounds([x1, y1, x2, y2], getFitBoundsOptions(map))
      } else if (cityGeoJSONLookup[moveTo]) {
         const [x1, y1, x2, y2] = cityGeoJSONLookup[moveTo].bbox
         map.fitBounds([x1, y1, x2, y2], getFitBoundsOptions(map))
      } else if (regionGeoJSONLookup[moveTo]) {
         const [x1, y1, x2, y2] = regionGeoJSONLookup[moveTo].bbox
         map.fitBounds([x1, y1, x2, y2], getFitBoundsOptions(map))
      } else if (moveTo === `home`) {
         const [x1, y1, x2, y2] = centreGeoJSON.bbox
         map.fitBounds([x1, y1, x2, y2], getFitBoundsOptions(map))
      }
      mapDispatch({ type: `MOVE`, payload: `` })
   }
}

function initializeMap(
   mapDispatch: (action: MapAction) => void,
   mapRef: React.MutableRefObject<HTMLDivElement>,
   centreGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties>
   // hash: { [key: string]: string | string[] } | null
) {
   return () => {
      async function run() {
         const { map, ...controls } = await createMap(mapRef.current, centreGeoJSON)
         map.on(`render`, () => 
            mapDispatch({
               type: `MOVING`,
               payload: {
                  bounds: map.getBounds(),
                  zoom: map.getZoom(),
                  renderedFeatures: map.queryRenderedFeatures({ layers: [`clusters`] } as any),
               },
            })
         )
         // map.on(`move`, () =>
         //    mapDispatch({
         //       type: `MOVING`,
         //       payload: {
         //          bounds: map.getBounds(),
         //          zoom: map.getZoom(),
         //          renderedFeatures: map.queryRenderedFeatures({ layers: [`clusters`] } as any),
         //       },
         //    })
         // )
         // map.on(`moveend`, () =>
         //    mapDispatch({
         //       type: `MOVING`,
         //       payload: {
         //          bounds: map.getBounds(),
         //          zoom: map.getZoom(),
         //          renderedFeatures: map.queryRenderedFeatures({ layers: [`clusters`] } as any),
         //       },
         //    })
         // )
         mapDispatch({
            type: `MOUNT`,
            payload: {
               map,
               ...controls,
               bounds: map.getBounds(),
               zoom: map.getZoom(),
               renderedFeatures: map.queryRenderedFeatures({ layers: [`clusters`] } as any),
            },
         })
      }
      run()
   }
}

function startMap(mapDispatch: (action: MapAction) => void, hash: { [key: string]: string | string[] } | null) {
   return () => {
      if (!hash) return
      debugger
      if (hash.h) {
         mapDispatch({ type: `MOVE`, payload: String(hash.h ?? ``).toLowerCase() })
      } else {
         mapDispatch({ type: `MOVE`, payload: `home` })
      }
   }
}

const TecMap = React.forwardRef<HTMLDivElement, Props>(({ children }, mapRef: React.MutableRefObject<HTMLDivElement>) => {
   const {
      state: { hash, winHeight, winWidth },
      dispatch: winDispatch,
   } = React.useContext(WinContext)
   // console.log({init1:hash})
   const { state: mapState, dispatch: mapDispatch } = React.useContext(MapContext)
   const {
      map,
      centreGeoJSON,
      centreGeoJSONLookup,
      cityGeoJSONLookup,
      regionGeoJSONLookup,
      bounds,
      zoom,
      renderedFeatures,
      moveTo,
      videoId,
   } = mapState

   if (!mapRef) mapRef = useRef<HTMLDivElement>(null)

   // React.useEffect(initializeMap(mapDispatch, mapRef, centreGeoJSON, hash))
   React.useEffect(initializeMap(mapDispatch, mapRef, centreGeoJSON), [])
   React.useEffect(startMap(mapDispatch, hash), [!!hash])
   React.useEffect(refreshHref(bounds, renderedFeatures, moveTo, hash?.h as string, winDispatch), [bounds, renderedFeatures, moveTo, hash?.h])
   React.useEffect(moveMapTo(map, centreGeoJSONLookup, cityGeoJSONLookup, regionGeoJSONLookup, centreGeoJSON, moveTo, mapDispatch), [
      map,
      hash?.h,
      moveTo,
   ])
   return (
      <>
         <div ref={mapRef}>
            <Featurebar />
            <Breadcrumb />
         </div>
         {zoom >= 17 && winWidth >= 800 && (
            <iframe
               style={{
                  position: `absolute`,
                  zIndex: 3,
                  bottom: `1rem`,
                  right: `1rem`,
                  width: winHeight >= 600 ? `420px` : `280px`,
                  height: winHeight >= 600 ? `236.25px` : `157.5px`,
                  borderRadius: `20px`,
                  opacity: 0.9,
                  pointerEvents: `none`,
               }}
               src={`https://www.youtube.com/embed/${videoId}?playsinline=1&autoplay=1&controls=0&disablekb=1&enablejsapi=1&fs=0&iv_load_policy=3&loop=1&origin=www.teamchong.com`}
               frameBorder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
         )}
         <div
            style={{
               position: `absolute`,
               bottom: 0,
               right: `1rem`,
               textShadow: `1px 1px #fff`,
               zIndex: 3,
            }}
         >
            {children}
            <a href="https://www.executivecentre.com/" target="_blank">
               The Executive Centre
            </a>
         </div>
      </>
   )
})

export { TecMap }
