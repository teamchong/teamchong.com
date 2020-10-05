import React, { useContext } from "react"
import { PageProps, graphql } from "gatsby"
import { MapState, mapReducer, initMapState, MapContext, MapAction } from "../contexts/map-context"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Featurebar from "../components/featurebar"
import Breadcrumb from "../components/breadcrumb"
import { getCentreGeoJSON, toGeoJSONLookup, getFitBoundsOptions } from "../utils/map-functions"
import { createMap } from "../utils/create-map"
import { CentreGeoJsonProperties, CentreNode, GeoJSONLookup } from "../utils/map-types"
import "mapbox-gl/dist/mapbox-gl.css"
import { LngLatBounds } from "mapbox-gl"
import { WinContext, WinAction } from "../contexts/win-context"

function initializeState(allCentresJson: { edges: Array<{ node: CentreNode }> }): MapState {
   const centreGeoJSON = getCentreGeoJSON(allCentresJson)

   return Object.assign(initMapState, {
      centreGeoJSON,
      centreGeoJSONLookup: toGeoJSONLookup(centreGeoJSON, ({ properties }) => properties.code?.toLowerCase() ?? ``),
      regionGeoJSONLookup: toGeoJSONLookup(centreGeoJSON, ({ properties }) => properties.region?.toLowerCase() ?? ``),
      cityGeoJSONLookup: toGeoJSONLookup(centreGeoJSON, ({ properties }) => properties.city?.toLowerCase() ?? ``),
   })
}

type Props = {
   site: {
      buildTime: string
   }
   allCentresJson: {
      edges: Array<{ node: CentreNode }>
   }
}

function refreshHref(
   bounds: LngLatBounds,
   renderedFeatures: Array<mapboxgl.MapboxGeoJSONFeature>,
   movingTo: string,
   href: string,
   winDispatch: (action: WinAction) => void
) {
   return () => {
      if (!bounds || movingTo) return
      let newHref: string = ``
      const [[bx1, by1], [bx2, by2]] = bounds.toArray()
      const featureCount = renderedFeatures.length
      let clusteredCount: number = 0
      let countriesCount: { [country: string]: number } = {}
      let citiesCount: { [city: string]: number } = {}
      let codesCount: { [code: string]: number } = {}
      for (const {
         properties: { countries, country, cities, city, codes, code },
      } of renderedFeatures) {
         if (!code) clusteredCount++
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
         if (code) {
            codesCount[code] = (codesCount[code] ?? 0) + 1
         } else {
            codes?.split(/\n/g).forEach(c => {
               codesCount[c] = (codesCount[c] ?? 0) + 1
            })
         }
      }
      // console.log({ featureCount, clusteredCount, countriesCount, citiesCount, codesCount, renderedFeatures })
      if (Object.keys(codesCount).length === 1) {
         newHref = Object.keys(codesCount)[0].toLowerCase()
      } else if (Object.keys(citiesCount).length === 1) {
         newHref = Object.keys(citiesCount)[0].toLowerCase()
      } else if (Object.keys(countriesCount).length === 1) {
         newHref = Object.keys(countriesCount)[0].toLowerCase()
      } else if (Object.keys(codesCount).length === 1) {
         newHref = Object.keys(codesCount)[0].toLowerCase()
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

function initializePage(
   mapDispatch: (action: MapAction) => void,
   mapRef: React.MutableRefObject<HTMLDivElement>,
   centreGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties>,
   hash: { [key: string]: string | string[] }
) {
   return () => {
      async function run() {
         const { map, ...controls } = await createMap(mapRef.current, centreGeoJSON)
         map.on(`move`, () =>
            mapDispatch({
               type: `MOVING`,
               payload: {
                  bounds: map.getBounds(),
                  zoom: map.getZoom(),
                  renderedFeatures: map.queryRenderedFeatures({ layers: [`clusters`] } as any),
               },
            })
         )
         map.on(`moveend`, () =>
            mapDispatch({
               type: `MOVING`,
               payload: {
                  bounds: map.getBounds(),
                  zoom: map.getZoom(),
                  renderedFeatures: map.queryRenderedFeatures({ layers: [`clusters`] } as any),
               },
            })
         )
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
         if (hash.h) {
            mapDispatch({ type: `MOVE`, payload: String(hash.h ?? ``).toLowerCase() })
         } else {
            mapDispatch({ type: `MOVE`, payload: `home` })
         }
      }
      run()
   }
}

const TecPage: React.FC<PageProps<Props>> = ({ data: { site, allCentresJson }, path }) => {
   const {
      state: { hash },
      dispatch: winDispatch,
   } = useContext(WinContext)
   const [mapState, mapDispatch] = React.useReducer(mapReducer, allCentresJson, initializeState)
   const { map, centreGeoJSON, centreGeoJSONLookup, cityGeoJSONLookup, regionGeoJSONLookup, bounds, zoom, renderedFeatures, moveTo, videoId } = mapState
   const mapRef = React.useRef<HTMLDivElement>(null)

   React.useEffect(initializePage(mapDispatch, mapRef, centreGeoJSON, hash), [])
   React.useEffect(refreshHref(bounds, renderedFeatures, moveTo, String(hash.h ?? ``), winDispatch), [bounds, renderedFeatures, moveTo, hash.h])
   React.useEffect(moveMapTo(map, centreGeoJSONLookup, cityGeoJSONLookup, regionGeoJSONLookup, centreGeoJSON, moveTo, mapDispatch), [
      map,
      hash.h,
      moveTo,
   ])
   return (
      <Layout>
         <SEO title="Map of TEC | Coworking Space | Virtual Office" />
         <MapContext.Provider value={{ state: mapState, dispatch: mapDispatch }}>
            <div ref={mapRef}>
               <Featurebar />
               <Breadcrumb />
            </div>
            {zoom >= 17 && (
               <iframe
                  style={{
                     position: `absolute`,
                     zIndex: 1,
                     bottom: `1rem`,
                     right: `1rem`,
                     width: `420px`,
                     height: `236.25px`,
                     borderRadius: `20px`,
                     opacity: 0.5,
                     pointerEvents: `none`,
                  }}
                  src={`https://www.youtube.com/embed/${videoId}?playsinline=1&autoplay=1&controls=0&disablekb=1&enablejsapi=1&fs=0&iv_load_policy=3&loop=1&origin=www.teamchong.com`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               ></iframe>
            )}
            <div style={{
               position: `absolute`,
               bottom: 0,
               right: `1rem`,
               textShadow: `1px 1px #fff`,
            }}><a href="https://www.executivecentre.com/" target="_blank">The Executive Centre</a></div>
         </MapContext.Provider>
      </Layout>
   )
}

export default TecPage

export const query = graphql`
   {
      site {
         buildTime(formatString: "YYYY-MM-DD hh:mm a z")
      }
      allCentresJson {
         edges {
            node {
               code
               name
               address
               city
               region
               phone
               fax
               currencyCode
               isActive
               isComingSoon
               longitude
               latitude
            }
         }
      }
   }
`
