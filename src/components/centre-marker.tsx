import mapboxgl from "mapbox-gl"
import React from "react"
import { MapContext } from "../contexts/map-context"
import { getFitBoundsOptions } from "../utils/map-functions"

type Props = React.RefAttributes<HTMLDivElement> &
   React.HTMLAttributes<HTMLDivElement> & {
      centreCode: string
      map: mapboxgl.Map
   }

function handleClick(map, e) {
   const { cluster_id } = map.queryRenderedFeatures(e.point, { layers: [`markers`] })?.[0]?.properties
   if (!cluster_id) return
   const clusterSource: mapboxgl.GeoJSONSource = map.getSource(`centres`)
   clusterSource.getClusterLeaves(cluster_id, 0, 0, (error, features) => {
      const bbox = features.reduce<[number, number, number, number]>((bbox, { geometry: { coordinates: [x, y] } }: any) => {
         if (!bbox) return [x, y, x, y]
         if (bbox[0] > x) bbox[0] = x
         if (bbox[1] > y) bbox[1] = y
         if (bbox[2] < x) bbox[2] = x
         if (bbox[3] < y) bbox[3] = y
         return bbox
      }, null)

      map.fitBounds(bbox, getFitBoundsOptions(map))
   })
}

const CentreMarker = React.forwardRef<HTMLDivElement, Props>(({ centreCode, map }, forwardedRef) => {
   const {
      state: { selectedCode },
   } = React.useContext(MapContext)
   return (
      <div
         id={`marker-${centreCode}`}
         className="marker"
         ref={forwardedRef}
         style={{ borderRadius: `100%`, backgroundColor: `#002E5D`, opacity: `0`, cursor: `pointer`, width: `118px`, height: `118px` }}
         onClick={ev => handleClick(ev, map)}
      ></div>
   )
})

export { CentreMarker }
