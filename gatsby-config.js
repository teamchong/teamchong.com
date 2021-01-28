module.exports = {
   siteMetadata: {
      title: `Hello, I'm Steven`,
      description: `Hong Kong - Steven Chong`,
      author: `@teamchong`,
   },
   plugins: [
      {
         resolve: `gatsby-plugin-netlify`,
         options: {
            headers: {
               "/*": [
                  "Access-Control-Allow-Origin: https://www.teamchong.com",
               ]
            }, // option to add more headers. `Link` headers are transformed by the below criteria
            allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
            mergeSecurityHeaders: true, // boolean to turn off the default security headers
            mergeLinkHeaders: true, // boolean to turn off the default gatsby js headers
            mergeCachingHeaders: true, // boolean to turn off the default caching headers
            transformHeaders: (headers, path) => headers, // optional transform for manipulating headers under each path (e.g.sorting), etc.
            generateMatchPathRewrites: true, // boolean to turn off automatic creation of redirect rules for client only paths
         },
      },
      // {
      //    resolve: "gatsby-plugin-load-script",
      //    options: {
      //       src: "https://cdn.jsdelivr.net/npm/aframe@1.1.0/dist/aframe-master.min.js",
      //       integrity: "sha256-ZGpOZKNSupcSIa8CSMnfNReamrJWVc9N7ljvKkUynOc=",
      //       crossorigin: "anonymous",
      //    },
      // },
      {
         resolve: `gatsby-plugin-browser-dependencies`,
         options: {
         dependencies: [
            `aframe`,
         ]
         },
      },
      `gatsby-plugin-react-helmet`,
      {
         resolve: `gatsby-source-filesystem`,
         options: {
            name: `images`,
            path: `${__dirname}/src/images`,
         },
      },
      `gatsby-transformer-sharp`,
      `gatsby-plugin-sharp`,
      {
         resolve: `gatsby-plugin-manifest`,
         options: {
            name: `teamchong.com`,
            short_name: `teamchong`,
            start_url: `/`,
            background_color: `#002E5D`,
            theme_color: `#002E5D`,
            display: `standalone`,
            icon: `${__dirname}/src/images/gatsby-icon.png`, // This path is relative to the root of the site.
         },
      },
      {
         resolve: "gatsby-plugin-scss-typescript",
         options: {
            cssLoaderOptions: {
               importLoaders: 1,
               localIdentName: "[name]_[local]___[hash:base64:5]_[emoji:1]",
            },
            sassLoaderOptions: {
               includePaths: [`${__dirname}/src/components`],
            },
            cssMinifyOptions: {
               assetNameRegExp: /\.optimize\.css$/g,
               canPrint: true,
            },
            cssExtractOptions: {
               filename: "[name].css",
               chunkFilename: "[id].css",
            },
         },
      },
      `gatsby-transformer-json`,
      {
         resolve: `gatsby-source-filesystem`,
         options: {
            name: `json_data`,
            path: `${__dirname}/src/data`,
         },
      },
      // this (optional) plugin enables Progressive Web App + Offline functionality
      "gatsby-plugin-fontawesome-css",
      // To learn more, visit: https://gatsby.dev/offline
      {
         resolve: `gatsby-plugin-offline`,
         options: {
            workboxConfig: {
               runtimeCaching: [
                  {
                     urlPattern: /(\.js$|\.css$|static\/)/,
                     handler: `CacheFirst`,
                  },
                  {
                     urlPattern: /^https?:.*\/page-data\/.*\/(page-data|app-data)\.json$/,
                     handler: `NetworkFirst`,
                     options: {
                        networkTimeoutSeconds: 1,
                     },
                  },
                  {
                     urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
                     handler: `StaleWhileRevalidate`,
                  },
                  {
                     urlPattern: /^https?:\/\/fonts\.googleapis\.com\/css/,
                     handler: `StaleWhileRevalidate`,
                  },
                  {
                     urlPattern: /\/$/,
                     handler: `NetworkFirst`,
                     options: {
                        networkTimeoutSeconds: 1,
                     },
                  },
               ],
            },
         },
      },
   ],
}
