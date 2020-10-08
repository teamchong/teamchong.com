module.exports = {
   siteMetadata: {
      title: `Hello, I'm Steven`,
      description: `Hong Kong - Steven Chong`,
      author: `@teamchong`,
   },
   plugins: [
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
      }, // this (optional) plugin enables Progressive Web App + Offline functionality
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
