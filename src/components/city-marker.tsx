import React from "react"
import { MapContext } from "../contexts/map-context"

type Props = React.RefAttributes<HTMLDivElement> &
   React.HTMLAttributes<HTMLDivElement> & {
      cityRegion: string
   }

const CityMarker = React.forwardRef<HTMLDivElement, Props>(({ cityRegion }, forwardedRef) => {
   const {
      state: { selectedCode },
   } = React.useContext(MapContext)
   return (
      <div id={`marker-${cityRegion}`} className={`marker${selectedCode ? `` : ` hidden`}`} ref={forwardedRef}>
         <img src="/tec-marker.svg" alt={`${cityRegion}`} />
      </div>
   )
})

export { CityMarker }
