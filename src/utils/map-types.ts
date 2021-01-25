type CentreGeoJsonProperties = GeoJSON.GeoJsonProperties & {
   id: string
   name: string
   address: string
   city: string
   region: string
   phone: string
   fax: string
   currencyCode: string
   isActive: boolean
   isComingSoon: boolean
   used: number
   total: number
}

// type CityGeoJsonProperties = GeoJSON.GeoJsonProperties & {
//    city: string
//    region: string
// }

type CentreNode = {
   id: string
   name: string
   address: string
   city: string
   region: string
   phone: string
   fax: string
   currencyCode: string
   isActive: boolean
   isComingSoon: boolean
   longitude: number
   latitude: number
}

type GeoJSONLookup = { [key: string]: GeoJSON.FeatureCollection<GeoJSON.Point, CentreGeoJsonProperties> }
// type CentreMarkerLookup = { [centreCode: string]: mapboxgl.Marker }
// type CityGeoJSONLookup = { [cityRegion: string]: GeoJSON.Feature<GeoJSON.MultiPoint, CityGeoJsonProperties> }
type CityMarkerLookup = { [cityRegion: string]: mapboxgl.Marker }
type MarkerRefLookup = { [key: string]: React.MutableRefObject<HTMLDivElement> }

export {
   CentreGeoJsonProperties,
   // CityGeoJsonProperties,
   CentreNode,
   GeoJSONLookup,
   // CentreMarkerLookup,
   // CityGeoJSONLookup,
   CityMarkerLookup,
   MarkerRefLookup,
}