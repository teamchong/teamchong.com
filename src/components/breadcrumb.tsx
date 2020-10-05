import React, { useContext } from "react"
import Tag from "react-bulma-components/lib/components/tag"
import BC from "react-bulma-components/lib/components/breadcrumb"
import Icon from "react-bulma-components/lib/components/icon"
import Dropdown from "react-bulma-components/lib/components/dropdown"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { MapContext } from "../contexts/map-context"
import { WinContext } from "../contexts/win-context"
import { GeoJSONLookup } from "../utils/map-types"

type BreadcrumbProps = React.RefAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>

const anchorStyle: React.CSSProperties = {
   background: `rgba(255,255,255,0.2)`,
   borderRadius: `0.3rem`,
   padding: `0.1rem`,
   boxShadow: `#ccc 2px 2px`,
   paddingLeft: `0.5rem`,
   fontWeight: `bold`,
}

type BreadcrumbState = {
   region: string | null
}

type BreadcrumbRegionChangeAction = {
   type: "REGION_CHANGE"
   payload: string
}

type BreadcrumbAction = BreadcrumbRegionChangeAction

function breadcrumbReducer(state: BreadcrumbState, action: BreadcrumbAction) {
   switch (action.type) {
      case `REGION_CHANGE`: {
         return Object.assign({}, state, { region: action.payload })
      }
      default: {
         throw new Error()
      }
   }
}

function renderLabel(href, children, count) {
   switch (href) {
      case `home`: {
         return (
            <>
               <Icon className="is-small">
                  <FontAwesomeIcon icon="home" />
               </Icon>
               {!!count && <Tag className="is-info tag-building">{count}</Tag>}
            </>
         )
      }
      default: {
         const flag = getFlag(href, ``)
         return (
            <>
               {flag ? <span className="label-building">{flag} {children}</span> : <span className="label-building">{children}</span>}
               {!!count && <Tag className="is-info tag-building">{count}</Tag>}
            </>
         )
      }
   }
}

function getCount(href: string, centreGeoJSONLookup: GeoJSONLookup, cityGeoJSONLookup: GeoJSONLookup, regionGeoJSONLookup: GeoJSONLookup) {
   if (regionGeoJSONLookup[href]) {
      return regionGeoJSONLookup[href].features.length
   } else if (cityGeoJSONLookup[href]) {
      return cityGeoJSONLookup[href].features.length
   } else if (href === `home`) {
      return Object.keys(centreGeoJSONLookup).length
   } else {
      return 0
   }
}

function getFlag(key: string, defaultValue: string = `🌐`) {
   const flags = {
      india: `🇮🇳`,
      australia: `🇦🇺`,
      taiwan: `🇹🇼`,
      korea: `🇰🇷`,
      singapore: `🇸🇬`,
      japan: `🇯🇵`,
      "hong kong": `🇭🇰`,
      china: `🇨🇳`,
      "sri lanka": `🇱🇰`,
      vietnam: `🇻🇳`,
      philippines: `🇵🇭`,
      indonesia: `🇮🇩`,
      macau: `🇲🇴`,
      "united arab emirates": `🇦🇪`,
   }
   return flags[key?.toLowerCase()] ?? defaultValue
}

function renderItems(href: string, centreGeoJSONLookup: GeoJSONLookup, cityGeoJSONLookup: GeoJSONLookup, regionGeoJSONLookup: GeoJSONLookup) {
   const items: Array<React.ReactNode> = []
   if (cityGeoJSONLookup[href]) {
      cityGeoJSONLookup[href].features.forEach(({ properties: { code, name } }) => {
         items.push(
            <Dropdown.Item key={code.toLowerCase()} value={code.toLowerCase()}>
               {name}
               {<Tag className="is-info tag-building">{code}</Tag>}
            </Dropdown.Item>
         )
      })
   } else if (regionGeoJSONLookup[href]) {
      const citiesLookup = regionGeoJSONLookup[href].features.reduce((cities, { properties: { city } }) => {
         if (city in cities) {
            cities[city]++
         } else {
            cities[city] = 1
         }
         return cities
      }, {})
      const cities = Object.keys(citiesLookup)
      cities.sort()
      cities.forEach(city => {
         const count = citiesLookup[city]
         items.push(
            <Dropdown.Item key={city.toLowerCase()} value={city.toLowerCase()}>
               {city}
               {!!count && <Tag className="is-info tag-building">{count}</Tag>}
            </Dropdown.Item>
         )
      })
   } else if (href === `home`) {
      const keys = Object.keys(regionGeoJSONLookup)
      keys.sort()
      keys.forEach(key => {
         const geoJSON = regionGeoJSONLookup[key]
         const count = geoJSON.features.length
         items.push(
            <Dropdown.Item key={key} value={key}>
               {getFlag(key)}&nbsp;&nbsp;
               {geoJSON.features[0].properties.region}
               {!!count && <Tag className="is-info tag-building">{count}</Tag>}
            </Dropdown.Item>
         )
      })
   }
   return items
}

const initialState = {
   region: null,
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({}) => {
   const { state: { hash } } = useContext(WinContext)
   const {
      state: { centreGeoJSONLookup, cityGeoJSONLookup, regionGeoJSONLookup },
      dispatch: mapDispatch,
   } = useContext(MapContext)
   const breadcrumbItems: Array<{ name: string; url: string; active?: boolean }> = [{ name: `Home`, url: `home` }]
   const href = String(hash.h ?? ``)
   if (centreGeoJSONLookup[href]) {
      const { region, city, name, code } = centreGeoJSONLookup[href].features[0].properties
      if (region !== city) {
         breadcrumbItems.push({ name: region, url: region.toLowerCase() })
      }
      if (Object.keys(cityGeoJSONLookup).length > 1) {
         breadcrumbItems.push({ name: city, url: city.toLowerCase() })
      }
      breadcrumbItems.push({ name, url: code.toLowerCase() })
   } else if (cityGeoJSONLookup[href]) {
      const { region, city } = cityGeoJSONLookup[href].features[0].properties
      if (region !== city) {
         breadcrumbItems.push({ name: region, url: region.toLowerCase() })
      }
      breadcrumbItems.push({ name: city, url: city.toLowerCase() })
   } else if (regionGeoJSONLookup[href]) {
      const { region } = regionGeoJSONLookup[href].features[0].properties
      breadcrumbItems.push({ name: region, url: region.toLowerCase() })
   }
   breadcrumbItems
      .filter(b => b.url === href)
      .forEach(b => {
         b.active = true
      })
   function handleClick(ev: React.MouseEvent<HTMLElement>, href: string) {
      if (!(ev.target as HTMLElement)?.closest?.(`.dropdown-item`)) {
         mapDispatch({ type: `MOVE`, payload: href?.toLowerCase() ?? `` })
      }
   }
   function handleChange(value: string) {
      mapDispatch({ type: `MOVE`, payload: value?.toLowerCase() ?? `` })
   }
   const Anchor = ({ children, href }) => {
      const items = renderItems(href, centreGeoJSONLookup, cityGeoJSONLookup, regionGeoJSONLookup)
      const hoverable = !!items.length
      return (
         <Dropdown
            hoverable={hoverable}
            up
            value=""
            onClick={ev => handleClick(ev, href)}
            onChange={handleChange}
            label={renderLabel(href, children, getCount(href, centreGeoJSONLookup, cityGeoJSONLookup, regionGeoJSONLookup))}
         >
            {items}
         </Dropdown>
      )
   }
   return (
      <BC
         className="is-size-7"
         renderAs={Anchor}
         items={breadcrumbItems}
         style={{
            position: `absolute`,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            margin: `0.5rem 0.1rem`,
         }}
      />
   )
}

export default Breadcrumb
