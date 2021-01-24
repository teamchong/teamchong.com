import { getCoord, center } from "@turf/turf"
import mapboxgl from "mapbox-gl"
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher"
import { CentreGeoJsonProperties } from "./map-types"
import { getFitBoundsOptions } from "./map-functions"
import { MapTypes } from "../contexts/map-context"
import Fuse from "fuse.js"
import type MapboxGeocoderType from "@mapbox/mapbox-gl-geocoder"

declare const MapboxGeocoder: MapboxGeocoderType | any

function createGeolocate(map: mapboxgl.Map) {
   const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
         enableHighAccuracy: true,
         // timeout: 0,
         // maximumAge: 0,
      },
      fitBoundsOptions: {
         //   linear?: boolean;
         //   padding?: number | mapboxgl.PaddingOptions;
         ...getFitBoundsOptions(map),
         //   offset?: mapboxgl.PointLike;
         //   maxZoom?: number;
         //   maxDuration?: number;
      },
      trackUserLocation: true,
      showAccuracyCircle: false,
      showUserLocation: true,
   })
   return geolocate
}

function createGeocoder(centreGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties>) {
   const opt = {
      accessToken: mapboxgl.accessToken,
      localGeocoder: localGeocoder(centreGeoJSON),
      mapboxgl,
      marker: false,
   }
   // console.log({opt})
   const geocoder = new MapboxGeocoder(opt)
   return geocoder
}

async function createMap(element: HTMLElement, centreGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties>): Promise<MapTypes> {
   const [x, y] = getCoord(center(centreGeoJSON))
   const map = new mapboxgl.Map({
      /** If true, an attribution control will be added to the map. */
      attributionControl: false,

      /** If true, enable the "box zoom" interaction (see BoxZoomHandler) */
      boxZoom: true,

      /** initial map center */
      center: [x, y],

      //   /** ID of the container element */
      container: element,

      /** Maximum zoom of the map. */
      maxZoom: 18,

      /** stylesheet location */
      // style: `mapbox://styles/mapbox/streets-v11`,
      style: `mapbox://styles/mapbox/satellite-streets-v11`,
      // keyboard: false,
   })

   map.scrollZoom.setWheelZoomRate(1 / 300)
   map.scrollZoom.setZoomRate(1 / 50)
   await new Promise<mapboxgl.Map>((resolve, reject) => {
      map.on(`style.load`, () => {
         initializeMap(map, centreGeoJSON, resolve, reject)
      })
   })
   const { navigation, geolocate, styleSwitcher, fullscreen, geocoder } = await new Promise<{
      navigation: mapboxgl.NavigationControl,
      geolocate: mapboxgl.GeolocateControl,
      styleSwitcher: MapboxStyleSwitcherControl,
      geocoder: MapboxGeocoderType,
      fullscreen: mapboxgl.FullscreenControl,
   }>((resolve, reject) => {
      try {
         map.on(`load`, () => {
            addEvents(map, centreGeoJSON)
            // addKeyControl(map)
            const navigation = new mapboxgl.NavigationControl({ showCompass: true, showZoom: true, visualizePitch: true })
            map.addControl(navigation, `top-right`)

            const geolocate = createGeolocate(map)
            map.addControl(geolocate, `top-right`)

            const styleSwitcher = createStyleSwitcher()
            map.addControl(styleSwitcher, `top-right`)

            const fullscreen = new mapboxgl.FullscreenControl({ container: null })
            map.addControl(fullscreen, `top-right`)

            const geocoder = createGeocoder(centreGeoJSON)
            map.addControl(geocoder, `top-left`) 
            resolve({ navigation, geolocate, styleSwitcher, fullscreen, geocoder })
         })
      } catch (error) {
         reject(error)
      }
   })
   return { map, navigation, geolocate, styleSwitcher, geocoder, fullscreen }
}

function createStyleSwitcher() {
   const styleSwitcher = new MapboxStyleSwitcherControl(
      [
         {
            title: `Streets`,
            uri: `mapbox://styles/mapbox/streets-v11`,
         },
         {
            title: `Outdoors`,
            uri: `mapbox://styles/mapbox/outdoors-v11`,
         },
         {
            title: `Light`,
            uri: `mapbox://styles/mapbox/light-v10`,
         },
         {
            title: `Dark`,
            uri: `mapbox://styles/mapbox/dark-v10`,
         },
         {
            title: `Satellite`,
            uri: `mapbox://styles/mapbox/satellite-v9`,
         },
         {
            title: `Satellite Streets`,
            uri: `mapbox://styles/mapbox/satellite-streets-v11`,
         },
      ],
      `Streets`
   )
   return styleSwitcher
}

function addSources(map: mapboxgl.Map, centreGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties>) {
   map.addSource(`centres`, {
      type: `geojson`,
      data: centreGeoJSON,
      cluster: true,
      clusterRadius: 50,
      clusterProperties: {
         countries: [
            [
               `case`,
               [`in`, [`get`, `countries`], [`accumulated`]],
               [`accumulated`],
               [`==`, [`accumulated`], ``],
               [`get`, `countries`],
               [`concat`, [`accumulated`], `\n`, [`get`, `countries`]],
            ],
            [`get`, `region`],
         ],
         cities: [
            [
               `case`,
               [`in`, [`get`, `cities`], [`accumulated`]],
               [`accumulated`],
               [`==`, [`accumulated`], ``],
               [`get`, `cities`],
               [`concat`, [`accumulated`], `\n`, [`get`, `cities`]],
            ],
            [`get`, `city`],
         ],
         ids: [
            [
               `case`,
               [`in`, [`get`, `ids`], [`accumulated`]],
               [`accumulated`],
               [`==`, [`accumulated`], ``],
               [`get`, `ids`],
               [`concat`, [`accumulated`], `\n`, [`get`, `ids`]],
            ],
            [`get`, `id`],
         ],
         usedSum: [`+`, [`get`, `used`]],
         totalSum: [`+`, [`get`, `total`]],
      },
   })
}

function addLayers(map: mapboxgl.Map) {
   map.addLayer({
      id: `markers`,
      type: `symbol`,
      source: `centres`,
      layout: {
         "icon-image": `tec-marker`,
         "icon-anchor": `bottom`,
         "icon-allow-overlap": true,
         "icon-ignore-placement": true,
         "icon-offset": [0, -10],
         "text-field": [
            `case`,
            [`has`, `point_count`],
            [
               `concat`,
               [
                  `case`,
                  [`in`, `\n`, [`get`, `cities`]],
                  [`case`, [`in`, `\n`, [`get`, `countries`]], ``, [`concat`, [`get`, `countries`], `\n`]],
                  [`concat`, [`get`, `cities`], `\n`],
               ],
               [`case`, [`in`, `\n`, [`get`, `names`]], ``, [`concat`, [`get`, `names`], `\n`]],
            ],
            [`concat`, [`get`, `city`], `\n`, [`get`, `name`]],
         ],
         "text-allow-overlap": false,
         "text-ignore-placement": false,
         "text-anchor": `top`,
         "text-size": 10,
      },
      paint: {
         "icon-opacity": 1,
         "text-translate": [0, 10],
         "text-color": `#002E5D`,
         "text-opacity": 0.8,
      },
   })

   map.addLayer({
      id: `hotspots`,
      type: `circle`,
      source: `centres`,
      paint: {
         "circle-color": `#ffffff`,
         "circle-radius": 30,
         "circle-opacity": 0,
         "circle-stroke-color": `#ffffff`,
         "circle-stroke-width": 5,
         "circle-stroke-opacity": 0,
      },
   })

   map.addLayer({
      id: `clusters`,
      type: `circle`,
      source: `centres`,
      paint: {
         "circle-color": `#002E5D`,
         "circle-radius": 10,
         "circle-opacity": 0.5,
         "circle-stroke-color": `#ffffff`,
         "circle-stroke-width": 0.7,
         "circle-stroke-opacity": 1,
      },
   })

   map.addLayer({
      id: `cluster-count`,
      type: `symbol`,
      source: `centres`,
      filter: [`has`, `point_count`],
      layout: {
         "text-field": [`get`, `point_count`],
         "text-size": 12,
         "text-allow-overlap": true,
         "text-ignore-placement": true,
         "text-font": [`DIN Offc Pro Medium`, `Arial Unicode MS Bold`],
      },
      paint: {
         "text-color": `#FFFFFF`,
      },
   })

   var layers = map.getStyle().layers

   var labelLayerId
   for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
         labelLayerId = layers[i].id
         break
      }
   }

   map.addLayer(
      {
         id: "3d-buildings",
         source: "composite",
         "source-layer": "building",
         filter: ["==", "extrude", "true"],
         type: "fill-extrusion",
         minzoom: 15,
         paint: {
            "fill-extrusion-color": "#aaa",

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "height"]],
            "fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "min_height"]],
            "fill-extrusion-opacity": 0.5,
         },
      },
      labelLayerId
   )
}

function addEvents(map: mapboxgl.Map, centreGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties>) {
   function handleMouseEnter() {
      map.getCanvas().style.cursor = `pointer`
   }
   function handleMouseLeave() {
      map.getCanvas().style.cursor = ``
   }
   function handleClick(ev: mapboxgl.MapMouseEvent) {
      const renderedFeatures: Array<mapboxgl.MapboxGeoJSONFeature> = map.queryRenderedFeatures(ev.point, { layers: [`markers`, `hotspots`] })
      const featureProperties = renderedFeatures?.[0]?.properties
      if (!featureProperties) return
      const { cluster_id, point_count } = featureProperties

      if (cluster_id) {
         const clusterSource = map.getSource(`centres`) as mapboxgl.GeoJSONSource
         clusterSource.getClusterLeaves(cluster_id, point_count, 0, (_error, features: Array<GeoJSON.Feature<GeoJSON.Point>>) => {
            const bbox = features.reduce<[number, number, number, number]>((bbox, { geometry: { coordinates: [x, y] } }) => {
               if (!bbox) return [x, y, x, y]
               if (bbox[0] > x) bbox[0] = x
               if (bbox[1] > y) bbox[1] = y
               if (bbox[2] < x) bbox[2] = x
               if (bbox[3] < y) bbox[3] = y
               return bbox
            }, null)
            map.fitBounds(bbox, getFitBoundsOptions(map))
         })
      } else if (featureProperties?.id) {
         const { id } = featureProperties
         const coordinates = centreGeoJSON.features?.filter(f => f.properties.id == id)?.map(f => f.geometry.coordinates)[0]
         if (coordinates) {
            const [x, y] = coordinates
            map.fitBounds([x, y, x, y], getFitBoundsOptions(map))
         }
      }
   }

   // inspect a cluster on click
   map.doubleClickZoom.disable()
   map.on(`click`, function(ev) { map.flyTo({ center: ev.lngLat }) })
   map.on(`mouseenter`, `markers`, handleMouseEnter)
   map.on(`mouseleave`, `markers`, handleMouseLeave)
   map.on(`click`, `markers`, handleClick)
   map.on(`mouseenter`, `hotspots`, handleMouseEnter)
   map.on(`mouseleave`, `hotspots`, handleMouseLeave)
   map.on(`click`, `hotspots`, handleClick)
}

function initializeMap(
   map: mapboxgl.Map,
   centreGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties>,
   resolve: () => void,
   reject: (error: Error) => void
) {
   try {
      addSources(map, centreGeoJSON)
      addLayers(map)
      const image = new Image()
      image.width = 50
      image.height = 50
      image.addEventListener(`load`, () => {
         map.addImage(`tec-marker`, image)
         resolve()
      })
      image.src = `/tec-marker.svg`
   } catch (error) {
      reject(error)
   }
}

function addKeyControl(map: mapboxgl.Map) {
   // pixels the map pans when the up or down arrow is clicked
   const deltaDistance = 100

   // degrees the map rotates when the left or right arrow is clicked
   const deltaDegrees = 25

   function easing(t) {
      return t * (2 - t)
   }
   map.getCanvas().addEventListener(
      `keydown`,
      function (ev) {
         // console.log(ev)
         ev.preventDefault()
         switch (ev.key) {
            case `ArrowUp`:
               map.panBy([0, -deltaDistance], { easing })
               break
            case `ArrowDown`:
               map.panBy([0, deltaDistance], { easing })
               break
            case `ArrowLeft`:
               map.easeTo({ bearing: map.getBearing() - deltaDegrees, easing })
               break
            case `ArrowRight`:
               map.easeTo({ bearing: map.getBearing() + deltaDegrees, easing })
               break
         }
      },
      true
   )
}

function localGeocoder(centreGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties>) {
   return (query: string) => {
      console.log({query})
      const options = {
         includeScore: true,
         includeMatches: true,
         findAllMatches: true,
         keys: [`properties.id`, `properties.name`, `properties.address`, `properties.city`, `properties.region`],
      }
      const fuse = new Fuse(centreGeoJSON.features, options)

      const matchingFeatures = fuse.search(query).map(({ item, matches, score }) => ({
         id: `place.${item.properties.id}`,
         type: `Feature`,
         place_type: [`place`],
         relevance: score,
         place_name: `${item.properties.name} (${item.properties.id})`,
         center: item.geometry.coordinates,
      }))
      return matchingFeatures
   }
}

export { createMap }
