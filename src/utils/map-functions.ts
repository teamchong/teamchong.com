import mapboxgl from "mapbox-gl"
import { CentreNode, GeoJSONLookup } from "./map-types"
import { CentreGeoJsonProperties } from "./map-types"

function getCentreGeoJSON(source: { edges: { node: CentreNode }[] }): GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties> {
   let bbox: GeoJSON.BBox = [
      source.edges[0].node.longitude,
      source.edges[0].node.latitude,
      source.edges[0].node.longitude,
      source.edges[0].node.latitude,
   ]
   const features: Array<GeoJSON.Feature<GeoJSON.Point, CentreGeoJsonProperties>> = []
   source.edges.forEach(
      (
         {
            node: {
               id,
               name,
               address,
               city,
               region,
               phone,
               fax,
               currencyCode,
               isActive,
               isComingSoon,
               longitude,
               latitude,
            },
         },
         i
      ) => {
         const total = 10 + ~~(Math.random() * 100)
         features.push({
            type: `Feature`,
            geometry: {
               type: `Point`,
               coordinates: [longitude, latitude],
            },
            properties: {
               id,
               name,
               address,
               city,
               region,
               phone,
               fax,
               currencyCode,
               isActive,
               isComingSoon,
               used: (0.3 + Math.random() * 7) * total,
               total,
            },
            bbox: [longitude, latitude, longitude, latitude],
         })
         if (i > 0) {
            if (bbox[0] > longitude) bbox[0] = longitude
            if (bbox[1] > latitude) bbox[1] = latitude
            if (bbox[2] < longitude) bbox[2] = longitude
            if (bbox[3] < latitude) bbox[3] = latitude
         }
      }
   )
   const featureCollection: GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties> = {
      type: `FeatureCollection`,
      bbox,
      features,
   }
   return featureCollection
}

function getFitBoundsOptions(map: mapboxgl.Map): mapboxgl.FitBoundsOptions {
   return map
      ? {
           padding: {
              top: ~~(map.getCanvas().clientHeight / 6),
              bottom: ~~(map.getCanvas().clientHeight / 6),
              left: ~~(map.getCanvas().clientWidth / 6),
              right: ~~(map.getCanvas().clientWidth / 6),
           },
        }
      : {}
}

function toGeoJSONLookup(
   centreGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties>,
   getter: (feature: GeoJSON.Feature<GeoJSON.Point, CentreGeoJsonProperties>) => string
): GeoJSONLookup {
   const geoJSONLookup = centreGeoJSON.features.reduce<GeoJSONLookup>((geoJSONLookup, feature) => {
      const key = getter(feature)
      const [x, y] = feature.geometry.coordinates
      if (key in geoJSONLookup) {
         const { bbox, features } = geoJSONLookup[key]
         if (bbox[0] > x) bbox[0] = x
         if (bbox[1] > y) bbox[1] = y
         if (bbox[2] < x) bbox[2] = x
         if (bbox[3] < y) bbox[3] = y
         features.push(feature)
      } else {
         geoJSONLookup[key] = {
            type: `FeatureCollection`,
            bbox: [x, y, x, y],
            features: [feature],
         }
      }
      return geoJSONLookup
   }, {})
   return geoJSONLookup
}

export { getCentreGeoJSON, getFitBoundsOptions, toGeoJSONLookup }
