import React from "react"
import { MapContext } from "../contexts/map-context"
import { WinContext } from "../contexts/win-context"
import { featurebarReducer, FeaturebarAction } from "../contexts/featurebar-context"
import Icon from "react-bulma-components/lib/components/icon"
import Card from "react-bulma-components/lib/components/card"
import Content from "react-bulma-components/lib/components/content"
import Button from "react-bulma-components/lib/components/button"
import Tag from "react-bulma-components/lib/components/tag"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import mapboxgl from "mapbox-gl"
import { CentreGeoJsonProperties } from "../utils/map-types"

const transitionStyle: React.CSSProperties = {
   position: `absolute`,
   transition: `transform 1s`,
   zIndex: 1,
}
const flexCenter: React.CSSProperties = {
   position: `absolute`,
   justifyContent: `center`,
   alignItems: `center`,
}
const featurebarContentStyle: React.CSSProperties = {
   width: `100%`,
   height: `100%`,
   // background: `rgba(255, 255, 255, 0.9)`,
   position: `relative`,
   pointerEvents: `all`,
}
const featurebarToggleStyle: React.CSSProperties = {
   position: `absolute`,
   width: `2.5rem`,
   height: `2.5rem`,
   overflow: `visible`,
   display: `flex`,
   justifyContent: `center`,
   alignItems: `center`,
   color: `rgb(0, 18, 36, 0.5)`,
   background: `rgba(255, 255, 255, 0.5)`,
   borderRadius: `100%`,
   border: `1px solid rgba(0, 0, 0, 0.5)`,
   boxShadow: `0 0 5px -2.5px #000`,
   cursor: `pointer`,
   zIndex: 7,
   ...transitionStyle,
}

type ToggleOption = {
   action: `EXPAND` | `COLLAPSE`
   featurebarStyle: React.CSSProperties
   featurebarWidth: string
   featurebarHeight: string
   mapEaseTo: { padding: Partial<mapboxgl.PaddingOptions> }
   toggleIcon: `chevron-right` | `chevron-left` | `chevron-up` | `chevron-down`
   toggleStyle: React.CSSProperties
   stickyStyle: React.CSSProperties
   featurebarContentStyle: React.CSSProperties
}

const collapsedOption: ToggleOption = {
   action: `EXPAND`,
   featurebarStyle: {
      ...transitionStyle,
      ...flexCenter,
      padding: `65px 0`,
      pointerEvents: `none`,
      top: 0,
      transform: `translateY(-400px)`,
   },
   featurebarWidth: `100%`,
   featurebarHeight: `400px`,
   mapEaseTo: { padding: { left: 0, top: 0 } },
   toggleIcon: `chevron-down`,
   toggleStyle: { ...featurebarToggleStyle, top: 0, pointerEvents: `auto`, transform: `translateY(465px)` },
   stickyStyle: { ...transitionStyle, width: `100%`, position: `relative`, transform: `translateY(440px)` },
   featurebarContentStyle: { ...featurebarContentStyle, overflow: `auto visible` },
}

const expandedOption: ToggleOption = {
   action: `COLLAPSE`,
   featurebarStyle: {
      ...transitionStyle,
      ...flexCenter,
      padding: `65px 0`,
      pointerEvents: `none`,
      top: 0,
      transform: ``,
   },
   featurebarWidth: `100%`,
   featurebarHeight: `400px`,
   mapEaseTo: { padding: { left: 0, top: 470 } },
   toggleIcon: `chevron-up`,
   toggleStyle: { ...featurebarToggleStyle, top: 0, pointerEvents: `auto`, transform: `translateY(350px)` },
   stickyStyle: { ...transitionStyle, width: `100%`, position: `relative`, transform: `` },
   featurebarContentStyle: { ...featurebarContentStyle, overflow: `auto visible` },
}

const expandedOptionLandscape: ToggleOption = {
   action: `COLLAPSE`,
   featurebarStyle: {
      ...transitionStyle,
      ...flexCenter,
      padding: `65px 0`,
      pointerEvents: `none`,
      left: 0,
      transform: ``,
   },
   featurebarWidth: `300px`,
   featurebarHeight: `100%`,
   mapEaseTo: { padding: { left: 300, bottom: 0 } },
   toggleIcon: `chevron-left`,
   toggleStyle: { ...featurebarToggleStyle, right: 0, pointerEvents: `auto`, bottom: `calc(50vh - 1.25rem)`, transform: `translateX(3rem)` },
   stickyStyle: { ...transitionStyle, width: `100%`, position: `relative`, transform: `` },
   featurebarContentStyle: { ...featurebarContentStyle, overflow: `visible auto` },
}

const collapsedOptionLandscape: ToggleOption = {
   action: `EXPAND`,
   featurebarStyle: {
      ...transitionStyle,
      ...flexCenter,
      padding: `65px 0`,
      pointerEvents: `none`,
      left: 0,
      transform: `translateX(-300px)`,
   },
   featurebarWidth: `300px`,
   featurebarHeight: `100%`,
   mapEaseTo: { padding: { left: 0, bottom: 0 } },
   toggleIcon: `chevron-right`,
   toggleStyle: { ...featurebarToggleStyle, right: 0, pointerEvents: `auto`, bottom: `calc(50vh - 1.25rem)`, transform: `translateX(3rem)` },
   stickyStyle: { ...transitionStyle, width: `100%`, position: `relative`, transform: `translateX(295px)` },
   featurebarContentStyle: { ...featurebarContentStyle, overflow: `visible auto` },
}

function getAction(action: `EXPAND` | `COLLAPSE`, renderedCentres: Array<GeoJSON.Feature<GeoJSON.Point, CentreGeoJsonProperties>>): FeaturebarAction {
   if (action == `EXPAND`) {
      return { type: action, payload: renderedCentres }
   } else {
      return { type: action }
   }
}

type FeaturebarProps = React.RefAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>

const Featurebar: React.FC<FeaturebarProps> = ({}) => {
   const {
      state: { winHeight, winWidth },
      dispatch: winDispatch,
   } = React.useContext(WinContext)
   const {
      state: { map, centreGeoJSONLookup, renderedCentres },
      dispatch: mapDispatch,
   } = React.useContext(MapContext)
   // console.log(renderedCentres)
   const [{ collapsed, selected, highlighted, next }, featurebarDispatch] = React.useReducer(featurebarReducer, {
      collapsed: true,
      selected: [],
      next: 0,
      nextTimeout: 0,
      highlighted: null,
   })
   const landscape = winWidth > winHeight
   const toggleOption = collapsed ? (landscape ? collapsedOptionLandscape : collapsedOption) : landscape ? expandedOptionLandscape : expandedOption

   const renderedPointed =
      (collapsed ? renderedCentres : selected)?.reduce((rendered, { properties: { point_count } }) => {
         return rendered + (point_count ?? 1)
      }, 0) ?? 0
   const highlightRef = React.useRef(null)
   const highlightedCentre = centreGeoJSONLookup[highlighted]

   React.useEffect(() => {
      map?.easeTo({ ...toggleOption.mapEaseTo, duration: 10000 / 2 })
   }, [map, collapsed, winWidth, winHeight])
   React.useEffect(() => {
      if (selected.length > 1) {
         highlightRef.current?.scrollIntoView({
            behavior: `smooth`,
            block: `center`,
         })
         if (highlightedCentre) {
            map.flyTo({
               center: [highlightedCentre.bbox[0], highlightedCentre.bbox[1]],
               zoom: 18,
               bearing: Math.random() * 360 - 180,
               pitch: 10 + Math.random() * 90,
               maxDuration: 500,
            })
         }
         autoPlayNext()
      }
      if (highlighted) {
         winDispatch({ type: `UPDATE_HASH`, payload: { h: highlighted } })
      }
   }, [selected, next, highlighted, highlightRef.current])

   function handleAutoPlay() {
      featurebarDispatch({ type: `AUTOPLAY` })
   }

   function autoPlayNext() {
      const idx = selected.findIndex(({ properties: { id } }) => id?.toLowerCase() == highlighted)
      const nextIdx = idx + 1 >= 0 && idx + 1 <= selected.length - 1 ? idx + 1 : 0
      const timeout = next ? setTimeout(() => {
         mapDispatch({ type: `RANDOM_VIDEO` })
         featurebarDispatch({ type: `HIGHLIGHT`, payload: selected[nextIdx].properties.id.toLowerCase() })
      }, next) as any : 0
      featurebarDispatch({ type: `NEXT`, payload: timeout })
   }

   return (
      <>
         {!!renderedCentres && (
            <div
               className="is-flex overflow-scroll-gradient"
               style={{
                  ...toggleOption.featurebarStyle,
                  width: toggleOption.featurebarWidth,
                  height: toggleOption.featurebarHeight,
               }}
            >
               <div style={{ ...toggleOption.featurebarContentStyle }}>
                  {!next && <Button fullwidth onClick={handleAutoPlay} style={{ marginTop: `1rem` }}>Auto play</Button>}
                  {Object.values(
                     selected.reduce<{ [key: string]: GeoJSON.Feature<GeoJSON.Point, CentreGeoJsonProperties> }>((centres, feature) => {
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
                  ).map(feature => {
                     const isHighlighted = feature.properties.id?.toLowerCase() === highlighted
                     const highlightProps: React.HtmlHTMLAttributes<HTMLDivElement> & any = isHighlighted
                        ? {
                             domRef: highlightRef,
                             style: {
                                border: `1px solid #002E5D`,
                                margin: `1rem 0.1rem`,
                                borderRadius: `1rem`,
                                pointerEvents: `all`,
                             },
                          }
                        : {
                             style: {
                                margin: `1rem 0.1rem`,
                                borderRadius: `1rem`,
                                pointerEvents: `all`,
                                backgroundColor: `rgba(255, 255, 255, 0.6)`,
                             },
                          }
                     // console.log({highlightProps})
                     return (
                        <Card key={feature.properties.id} {...highlightProps}>
                           <Card.Header>
                              <Card.Header.Title>
                                 {feature.properties.name}
                                 <Tag className="is-info tag-building">{feature.properties.id}</Tag>
                              </Card.Header.Title>
                           </Card.Header>
                           <Card.Content>
                              <Content>{feature.properties.address}</Content>
                           </Card.Content>
                           <Card.Footer>
                              {selected.length > 1 && 
                              <Card.Footer.Item renderAs="a" onClick={() => featurebarDispatch({ type: `HIGHLIGHT`, payload: feature.properties?.id.toLowerCase() ?? null })}>
                                 Select
                              </Card.Footer.Item>}
                              <Card.Footer.Item renderAs="a" href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}`} target="_blank">
                                 Street View
                              </Card.Footer.Item>
                              <Card.Footer.Item renderAs="a" href={`https://www.google.com/maps/dir/?api=1&origin=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}&destination=${encodeURIComponent(feature.properties.city)}`} target="_blank">
                                 Directions
                              </Card.Footer.Item>
                              <Card.Footer.Item renderAs="a" href={`/tec-centre/${feature.properties.id}/`} target="_blank">
                                 Details
                              </Card.Footer.Item>
                           </Card.Footer>
                        </Card>
                     )
                  })}
               </div>
               <Icon
                  className="is-size-3"
                  style={toggleOption.toggleStyle}
                  // onMouseOver={() => featurebarDispatch(getAction(toggleOption.action, renderedCentres))}
                  onClick={() => featurebarDispatch(getAction(toggleOption.action, renderedCentres))}
               >
                  <>
                     <FontAwesomeIcon icon={toggleOption.toggleIcon} />
                     <span style={{ marginTop: `1.5rem`, marginLeft: `1.5rem`, position: `absolute` }}>
                        <Tag className="is-info tag-building">{renderedPointed}</Tag>
                     </span>
                  </>
               </Icon>
            </div>
         )}
      </>
   )
}

export default Featurebar
