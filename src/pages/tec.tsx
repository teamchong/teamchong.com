import React from "react"
import { PageProps, graphql } from "gatsby"
import { MapState, mapReducer, initMapState, MapContext } from "../contexts/map-context"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { getCentreGeoJSON, toGeoJSONLookup } from "../utils/map-functions"
import { CentreNode } from "../utils/map-types"
import { TecMap } from "../components/tec-map"

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

const TecPage: React.FC<PageProps<Props>> = ({ data: { site, allCentresJson }, path }) => {
   const [mapState, mapDispatch] = React.useReducer(mapReducer, allCentresJson, initializeState)
   const mapRef = React.useRef<HTMLDivElement>(null)

   return (
      <Layout>
         <SEO title="Map of TEC | Coworking Space | Virtual Office">
            <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.min.js"></script>
            <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.css" type="text/css" />
         </SEO>
         <MapContext.Provider value={{ state: mapState, dispatch: mapDispatch }}>
            <TecMap ref={mapRef}/>
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
