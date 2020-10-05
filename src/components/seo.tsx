/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

type Props = {
   description?: string
   lang?: string
   meta?: { name: string; content: string }[]
   title: string
}

type State = {
   href: string | null
}

type SetHrefAction = {
   type: `SET_HREF`
   payload: string
}

type Action = SetHrefAction

function reducer(state: State, action: Action) {
   switch (action.type) {
      case `SET_HREF`:
         return Object.assign(state, { href: action.payload })
      default:
         throw new Error()
   }
}

const initialState = { href: null }

const SEO: React.FC<Props> = ({ description = ``, lang = `en`, meta = [], title }) => {
   const { site } = useStaticQuery(
      graphql`
         query {
            site {
               siteMetadata {
                  title
                  description
                  author
               }
            }
         }
      `
   )

   const [state, dispatch] = React.useReducer(reducer, initialState)

   React.useEffect(() => {
      if (typeof window !== `undefined`) {
         dispatch({ type: `SET_HREF`, payload: window.location.href })
      }
   })
   const metaDescription = description || site.siteMetadata.description
   const defaultTitle = site.siteMetadata?.title
   const { href } = state

   return (
      <Helmet
         htmlAttributes={{
            lang,
         }}
         title={title}
         titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
         meta={[
            {
               name: `description`,
               content: metaDescription,
            },
            {
               property: `og:title`,
               content: title,
            },
            {
               property: `og:description`,
               content: metaDescription,
            },
            {
               property: `og:type`,
               content: `website`,
            },
            {
               name: `twitter:card`,
               content: `summary`,
            },
            {
               name: `twitter:creator`,
               content: site.siteMetadata?.author || ``,
            },
            {
               name: `twitter:title`,
               content: title,
            },
            {
               name: `twitter:description`,
               content: metaDescription,
            },
         ].concat(meta)}
      >
         {/^http:/.test(href) && !/\/\/localhost:/.test(href) ? (
            <meta http-equiv="refresh" content={`0;url=${href.replace(/^http:/, `https:`)}`} />
         ) : null}
         <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.min.js"></script>
         <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.css" type="text/css" />
         {/* <link
            href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
            rel="stylesheet"
            type="text/css"
         /> */}
      </Helmet>
   )
}

export default SEO
