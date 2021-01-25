/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`)
const fs = require(`fs`)

// Log out information after a build is done
exports.sourceNodes = ({ actions, createContentDigest }) => {
   try {
      const { createNode } = actions
      const rootPath = path.join(__dirname, "static", "360")
      const images360 = fetchImages360(rootPath)
      // const webCentres = JSON.parse(fs.readFileSync(path.join(__dirname, 'webCentres.json'), {encoding: 'utf-8'}))
      const rooms = images360.map(transformNode)
      rooms.forEach(room =>
         createNode({
            ...room,
            parent: null,
            children: [],
            internal: {
               type: `RoomJson`,
               contentDigest: createContentDigest(room),
            },
         })
      )
   } catch (error) {
      console.error(error)
   }
}
exports.onCreateNode = ({ node, getNodesByType, actions }) => {
   const { createNodeField } = actions
   // console.log(node)
   switch (node.internal.type) {
      case "RoomJson":
         if (node.centre) {
            createNodeField({
               node,
               name: "website___NODE",
               value: `URL:${node.centre}`,
            })
         }
         if (node.centreCode) {
            createNodeField({
               node,
               name: "centre___NODE",
               value: node.centreCode,
            })
         }
         break
      case "WebsiteJson":
         if (node.url) {
            node.url = `https://www.executivecentre.com/office-space/${node.url}/`
         }
         break
      case "CentreJson":
         const rooms = getNodesByType("RoomJson").filter(r => r.centreCode == node.id)
         if (rooms.length) {
            createNodeField({
               node,
               name: "rooms___NODE",
               value: rooms.map(r => r.id),
            })
         }
         break
   }
}
exports.onPostBuild = ({ reporter }) => {
   roomNodes = {}
   reporter.info(`Your Gatsby site has been built!`)
}
// // Create blog pages dynamically
exports.onCreatePage = async ({ page, actions }) => {
   const { createPage } = actions
   // console.log(page)
   if (page && page.path && /^\/tec\//.test(page.path)) {
      createPage({
         path: "/tec/",
         matchPath: "/tec/*",
         component: path.resolve("src/pages/tec.tsx"),
      })
   }
}
exports.createPages = async ({ graphql, actions }) => {
   const { createPage } = actions
   const result = await graphql(`
      query {
         allCentreJson {
            edges {
               node {
                  address
                  city
                  currencyCode
                  fax
                  fields {
                     rooms {
                        centre
                        centreCode
                        city
                        fields {
                           website {
                              url
                           }
                        }
                        file
                        id
                        market
                        path
                     }
                  }
                  id
                  isActive
                  isComingSoon
                  latitude
                  longitude
                  name
                  phone
                  region
               }
            }
         }
      }
   `)
   // console.log(result)
   result.data.allCentreJson.edges.forEach(
      ({ node: { address, city, currencyCode, fax, fields, id, isActive, isComingSoon, latitude, longitude, name, phone, region } }) => {
         createPage({
            path: `/tec-centre/${id}/`,
            matchPath: `/tec-centre/${id}/*`,
            component: path.resolve("src/pages/tec-centre.tsx"),
            context: {
               address,
               city,
               currencyCode,
               fax,
               rooms: ((fields || {}).rooms || []).map(r => ({
                  centre: r.centre,
                  centreCode: r.centreCode,
                  city: r.city,
                  websiteUrl: ((r.fields || {}).website || {}).url,
                  file: r.file,
                  id: r.id,
                  market: r.market,
                  path: r.path,
               })),
               id,
               isActive,
               isComingSoon,
               latitude,
               longitude,
               name,
               phone,
               region,
            },
         })
      }
   )
}

function fetchFiles(path1) {
   const opt = { withFileTypes: true }
   let output = []
   for (const file of fs.readdirSync(path1, opt)) {
      const newPath = path.join(path1, file.name)

      if (file.isFile()) {
         if (/\.jpg$/.test(file.name)) {
            output = [...output, newPath]
         }
      } else {
         output = [...output, ...fetchFiles(newPath)]
      }
   }
   return output
}

function fetchImages360(path1) {
   return fetchFiles(path1).map(f => f.substr(path1.length + 1))
}

function transformNode(path) {
   const paths = path.split("/")
   const market = paths[0]
   const cityIdx = paths.length > 3 ? 1 : 0
   const city = paths[cityIdx]
   const centre = paths[cityIdx + 1]
   const file = paths.filter((_, i) => i > cityIdx + 1).join("/")
   const id = file.replace(/^[0-9]{2} |\.jpg$/gi, "")
   const centreCode = centreCodes[centre]
   return { id, path, market, city, centre, file, centreCode }
}

const centreCodes = {
   "One One One Eagle Street": "BES",
   "Collins Square Tower Five": "CSQ",
   "108 St Georges Terrace": "PER",
   "1 Bligh Street": "1BL",
   "Aurora Place": "AUR",
   "Australia Square": "ASQ",
   "Governor Phillip Tower": "GPT",
   "Three International Towers": "IT3",
   "Beijing Yintai Centre": "YTC",
   "China Central Place": "CCP",
   "China World Tower B": "CW5",
   "International Finance Square": "IFC",
   "Modern International Financial Centre": "IFC",
   "Pingan Finance Centre": "PFC",
   "Raffles City": "RCC",
   "Yintai Centre": "CYT",
   "Corporate Avenue Centre": "CAC",
   "CTF Finance Centre": "K11",
   "Taikoo Hui Tower 1": "TKH",
   "The One Place": "TOP",
   "Cambridge House": "CBH",
   "Nexxus Building": "NEX",
   "One IFC": "hk-central-one-ifc",
   "One Island East": "OIE",
   "PCCW Tower": "PCW",
   "Prosperity Tower": "PTC",
   "The Hong Kong Club Building": "HKC",
   "Three Garden Road": "3GR",
   "Two Chinachem Central": "CCC",
   "Two Pacific Place": "2PP",
   "5 Corporate Avenue": "5CA",
   "HKR1 Taikoo Hui Centre 2": "HR2",
   "Jing An Kerry Centre": "KJA",
   "Mirae Asset Tower": "MIR",
   "Shanghai IFC Tower 2": "IFC",
   "The Center": "CEN",
   "China Resources Tower": "CRS",
   "GEM Tower": "GEM",
   "Kerry Plaza Tower 1": "KT1",
   "Kerry Plaza Tower 2": "KER",
   "Kerry Plaza Tower 3": "KT3",
   "Taiping Finance Tower": "TFT",
   "101 Tower": "TAI",
   "Far Eastern Plaza": "FEP",
   "Nanshan Plaza": "NAN",
   "Neihu New Century Building": "NNC",
   "Helios Business Park": "RTP",
   "Hyderabad Centres": "SKC",
   "Olympia Teknos Park": "OTC",
   "DLF Cyber City": "DB5",
   "Two Horizon Centre": "2HC",
   "First International Financial Centre": "FIF",
   "Maker Maxity": "MMM",
   "TEC DLF Centre": "DLF",
   "One Pacific Place": "PPJ",
   "Sampoerna Strategic Square": "SSS",
   "Cerulean Tower": "CRT",
   "Jingumae Tower Building": "J12",
   "Kyobashi Edogrand": "EDO",
   "Ropopongi Hills North Tower": "RNT",
   "Sanno Park": "SPT",
   "Shin-Marunouchi Center Building": "SMC",
   "Minato Mirai Centre Building": "MMC",
   "Frasers Tower": "FTS",
   "Marina Bay Financial Centre": "MBF",
   "Ocean Financial Centre": "OFC",
   "One Raffles Quay": "ORQ",
   "Six Battery Road": "6BR",
   "The Gateway West": "GWW",
   "Gangnam Finance Center": "GFC",
   "Glass Tower": "SGT",
   "International Finance Centre 2": "IFS",
   "International Finance Centre 3": "SF3",
   "Seoul Finance Centre": "SFC",
   "One Central": "1C3",
   "Friendship Tower": "FTR",
   "Saigon Centre Tower 1": "SC1",
   "World Trade Center 2": "WT2",
   "The Capital": "BKC",
   "Kalpataru Synergy": "KPS",
   "Capital Building 2": "BK2",
   "Gangnam Finance Centre L4": "GF2",
   "Shin Marunouchi Centre L20": "SM2",
   "Business Bay": "PBB",
   "Citic Square": "CIT",
   "Chong Hing Finance Center": "CHF",
   "Kerry Centre Hangzhou": "KHZ",
   "Hyundai Motor Tower": "HMT",
   "Beijing Yintai Centre L31": "YT2",
   "Financial Street Centre": "FSP",
   "Chengdu IFS": "CIF",
   "Mfar Greenheart Manyata Tech Park": "MFR",
   "World Trade Center": "WTC",
   "Qutab Crescent Centre": "QTB",
   "Prestige Khoday Tower": "KHO",
   "Prestige Trade Tower": "PTT",
   "K Wah Centre": "KWA",
   "Maga One": "MG1",
   "World Trade Center Colombo": "coL",
   "Enterprise Headquarter Building": "EHQ",
   "China Central Place L6": "CC2",
   Xintiandi: "XTD",
   "RCBC Plaza": "RCB",
   "Ocean Financial Centre L37": "OF2",
   HNA: "HNA",
   "Jongno Tower": "JNT",
   "Roppongi Hills North Tower L16": "RN2",
   "28 Hennessy Road": "28H",
   "One Horizon Center": "1HC",
   "Tamarai Tech Park": "TTP",
   "Prestige Palladium Chennai": "PPC",
   "Northpoint Tower": "NPS",
   "Prudential Tower": "PRU",
   "Two Exchange Square": "EXC",
   "Shui On Plaza": "SOP",
   "K11 L8 Conference Centre": "K08",
   "K11 L38": "K12",
   "Three Pacific Place": "TPP",
   "China World Office 1": "CWO",
   "China Resources Building": "CRB",
   "China World Office 2": "CW3",
   "Hong Kong One IFC": "1FC",
   Tribe: "CRC",
   "UB City": "UBC",
   "Taipei Nanshan Plaza L37": "NA2",
   "World Financial Centre": "WFC",
   "TEDA MSD C1 Tower": "MSD",
   "The Exchange Tower 2": "EXT",
   "Innovative Financial Building": "YJP",
   "Jingumae Tower Building L13": "J13",
   "AIA Tower": "AIA",
   "Jingumae Tower Building L14": "J14",
   "HKRI Taikoo Hui Center I": "HR1",
   "DLF Cyber Park": "DCP",
   "BEA Finance Tower L8": "BE8",
   "Safina Towers L2": "SA2",
   "Kaman Amaryllis": "KAM",
   "DLF Centre L8": "DL2",
   "Metropolitan Oriental Plaza": "MOP",
   "Salarpuria Sattva Knowledge City L7": "SK2",
}
