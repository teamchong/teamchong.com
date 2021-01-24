/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */
import React from "react"
import { useStaticQuery, graphql } from "gatsby"

// import Header from "./header"
import "./layout.scss"
import "mapbox-gl-style-switcher/styles.css"
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"
import { WinContext, winReducer } from "../contexts/win-context"

import { library } from "@fortawesome/fontawesome-svg-core"
import {
   faChevronLeft,
   faChevronRight,
   faChevronUp,
   faChevronDown,
   faHome,
   faAngleDoubleDown,
   faEnvelopeSquare,
   faAddressCard,
   faQrcode
} from "@fortawesome/free-solid-svg-icons"
import { faFacebookSquare, faGithubSquare, faLinkedin, faWhatsappSquare, faSkype } from "@fortawesome/free-brands-svg-icons"
library.add(
   faChevronLeft,
   faChevronRight,
   faChevronUp,
   faChevronDown,
   faHome,
   faAngleDoubleDown,
   faEnvelopeSquare,
   faAddressCard,
   faQrcode,
   faFacebookSquare,
   faGithubSquare,
   faLinkedin,
   faWhatsappSquare,
   faSkype
)
import querystring from "querystring"

type Props = {
   children: React.ReactNode
}

function getHash() {
   try {
      // return querystring.parse(window.location.hash?.replace(/^#/, ``))
      return {h:window.location.pathname.replace(/^\/tec\//, '')}
   } catch (error) {
      return {}
   }
}

const Layout: React.FC<Props> = ({ children }) => {
   // const data = useStaticQuery(graphql`
   //    query SiteTitleQuery {
   //       site {
   //          siodyMetadata {
   //             title
   //          }
   //       }
   //    }
   // `)
   const [winState, winDispatch] = React.useReducer(winReducer, { winWidth: null, winHeight: null, hash: {h:window.location.pathname.replace(/^\/tec\//, '')} })
   
   React.useEffect(() => {
      winDispatch({ type: `INITIALIZE`, payload: { winWidth: window.innerWidth, winHeight: window.innerHeight, hash: getHash() } })
      window.addEventListener(`resize`, () =>
         winDispatch({ type: `RESIZE`, payload: { winWidth: window.innerWidth, winHeight: window.innerHeight } })
      )
      window.addEventListener(`orientationchange`, () =>
         winDispatch({ type: `RESIZE`, payload: { winWidth: window.innerWidth, winHeight: window.innerHeight } })
      )
      // window.addEventListener(`hashchange`, (ev) => {
      //    winDispatch({ type: `HASH_CHANGE`, payload: getHash() })
      // })
   }, [])

   return (
      <WinContext.Provider value={{ state: winState, dispatch: winDispatch }}>
         {children}
      </WinContext.Provider>
   )
}

export default Layout
