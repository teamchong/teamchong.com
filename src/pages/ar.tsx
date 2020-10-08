import React from "react"
import loadable from "@loadable/component"
import { PageProps, graphql } from "gatsby"
import { MapState, mapReducer, initMapState, MapContext } from "../contexts/map-context"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { getCentreGeoJSON, toGeoJSONLookup } from "../utils/map-functions"
import { CentreNode } from "../utils/map-types"
import "mapbox-gl/dist/mapbox-gl.css"
import { TecMap } from "../components/tec-map"
// import html2canvas from "html2canvas"

declare global {
   var handTrack: any
}

let cursorEv: MouseEvent

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

// const HandTrack = loadable(
//    () =>
//       new Promise((resolve, reject) => {
//          async function load() {
//             try {
//                if (!window.handTrack) return requestAnimationFrame(load)
//                const video = document.querySelector("#arjs-video")
//                if (!video) return requestAnimationFrame(load)
//                const modelParams = {
//                   // flipHorizontal: true,   // flip e.g for video
//                   // imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
//                   // maxNumBoxes: 20,        // maximum number of boxes to detect
//                   // iouThreshold: 0.5,      // ioU threshold for non-max suppression
//                   // scoreThreshold: 0.79,    // confidence threshold for predictions.
//                }
//                const model = await handTrack.load(modelParams)
//                // video.addEventListener(`loadeddata`, async () => {
//                console.log(`startVideo`)
//                await handTrack.startVideo(video)
//                function detect() {
//                   model
//                      .detect(video)
//                      .then(predictions => {
//                         console.log({ predictions })
//                      })
//                      .catch(error => console.error(error))
//                   model.render
//                   requestAnimationFrame(detect)
//                }
//                console.log(`detect`)
//                detect()
//                // })
//                resolve({ default: React.Fragment })
//             } catch (error) {
//                reject(error)
//             }
//          }
//          load()
//       })
// )

const Scene = loadable(
   () =>
      new Promise((resolve, reject) => {
         function load() {
            try {
               if (!window.AFRAME || !window.AFRAME.systems.arjs) return requestAnimationFrame(load)
               setTimeout(() => {
                  const scene = Object.entries({
                     id: `scene`,
                     embedded: ``,
                     "vr-mode-ui": `enabled: false`,
                     arjs: `trackingMethod: best; sourceType: webcam; debugUIEnabled: false;`,
                     // "gesture-detector": ``,
                     "loading-screen": `enabled: true;`,
                     "keyboard-shortcuts": `enterVR: false;`,
                     style: `width: 100vw; height: 100vh; pointer-events: none;`,
                  }).reduce((el, [key, val]) => {
                     el.setAttribute(key, val)
                     return el
                  }, document.createElement(`a-scene`))

                  // scene.addEventListener("loaded", function () {
                  const marker = Object.entries({
                     id: `animated-marker`,
                     type: `pattern`,
                     preset: `custom`,
                     url: `/pattern-qr-code.patt`,
                     raycaster: `objects: .clickable`,
                     emitevents: `true`,
                     cursor: `fuse: false; rayOrigin: mouse;`,
                  }).reduce((el, [key, val]) => {
                     el.setAttribute(key, val)
                     return el
                  }, document.createElement(`a-marker`))
                  marker.addEventListener(`markerLost`, () => {
                     marker.object3D.visible = true
                  })

                  scene.appendChild(marker)

                  // const camera = Object.entries({
                  //       camera: ``,
                  //    }).reduce((el, [key, val]) => {
                  //       el.setAttribute(key, val)
                  //       return el
                  //    }, document.createElement(`a-entity`))
                  // scene.appendChild(camera)

                  AFRAME.registerComponent(`draw-canvas`, {
                     schema: { default: "" },
                     init() {
                        this.canvas = canvas
                        this.ctx = this.canvas.getContext("2d")
                     },
                  })
                  // AFRAME.registerComponent("canvas-updater", {
                  //    dependencies: ["geometry", "material"],

                  //    tick: function () {
                  //       var el = this.el
                  //       var material

                  //       material = el.getObject3D("mesh").material
                  //       if (!material.map) {
                  //          return
                  //       }
                  //       material.map.needsUpdate = true
                  //    },
                  // })
                  // console.log(plane)

                  // const img = Object.entries({
                  //    src: `/pattern-qr-code.png`,
                  //    scale: `5 5 5`,
                  //    class: `clickable`,
                  //    rotation: `-90 0 0`,
                  //    "gesture-handler": ``,
                  // }).reduce((el, [key, val]) => {
                  //    el.setAttribute(key, val)
                  //    return el
                  // }, document.createElement(`a-image`))
                  // marker.appendChild(img)

                  const assets = document.createElement(`a-assets`)
                  const canvas: HTMLCanvasElement = document.createElement(`canvas`) as any
                  canvas.setAttribute(`id`, `mapboxgl-canvas`)
                  assets.appendChild(canvas)
                  scene.appendChild(assets)

                  const plane = Object.entries({
                     geometry: `primitive: sphere`,
                     material: `src: #mapboxgl-canvas`,
                     "draw-canvas": `mapboxgl-canvas`,
                     scale: `2 2 2`,
                     class: `clickable`,
                     rotation: `-90 0 0`,
                     // "gesture-handler": ``,
                     // "canvas-updater": ``,
                  }).reduce((el, [key, val]) => {
                     el.setAttribute(key, val)
                     return el
                  }, document.createElement(`a-entity`))

                  marker.appendChild(plane)

                  const camera = Object.entries({
                     camera: ``,
                  }).reduce((el, [key, val]) => {
                     el.setAttribute(key, val)
                     return el
                  }, document.createElement(`a-entity`))
                  scene.appendChild(camera)

                  if (document.body.firstChild) {
                     document.body.insertBefore(scene, document.body.firstChild)
                  } else {
                     document.body.appendChild(scene)
                  }

                  function render() {
                     try {
                        const mapCanvas: HTMLCanvasElement = document.querySelector(`.mapboxgl-canvas`) as any
                        const markerVisible = marker.object3D.visible
                        if (mapCanvas) {
                           let width = Math.min(mapCanvas.width, mapCanvas.height * 2)
                           let testWidth = 1
                           while (width > testWidth) {
                              const nextTestWidth = testWidth << 1
                              if (nextTestWidth > width) {
                                 width = testWidth
                                 break
                              }
                              testWidth = nextTestWidth
                           }
                           const ctx = canvas.getContext(`2d`)
                           // html2canvas(map).then(result => {
                           if (canvas.width !== width) {
                              canvas.width = width
                           }
                           if (canvas.height !== width / 2) {
                              canvas.height = width / 2
                           }
                           ctx.drawImage(
                              mapCanvas,
                              0,
                              0,
                              mapCanvas.width,
                              mapCanvas.height,
                              -((canvas.width * 1) / 4),
                              0,
                              canvas.width,
                              canvas.height
                           )
                           ctx.drawImage(mapCanvas, 0, 0, mapCanvas.width, mapCanvas.height, (canvas.width * 3) / 4, 0, canvas.width, canvas.height)
                           // console.log(cursorEv)
                           if (cursorEv) {
                              let x = (cursorEv.clientX / window.innerWidth) * canvas.width - (canvas.width * 1) / 4
                              if (x < 0) x += canvas.width
                              const y = (cursorEv.clientY / window.innerHeight) * canvas.height
                              ctx.beginPath()
                              ctx.arc(x, y, 10, 0 * Math.PI, 2 * Math.PI)
                              ctx.fill()
                           }
                           mapCanvas.style.opacity = markerVisible ? `0` : ``
                           const map = (plane.getObject3D("mesh") as any)?.material?.map
                           if (map) map.needsUpdate = true
                           // })
                        }
                     } catch (error) {
                        console.error(error)
                     }
                     requestAnimationFrame(render)
                  }
                  render()

                  resolve({ default: React.Fragment })
               }, 1000)
            } catch (error) {
               reject(error)
            }
         }
         load()
      })
)

const ArPage: React.FC<PageProps<Props>> = ({ data: { site, allCentresJson }, path }) => {
   const [mapState, mapDispatch] = React.useReducer(mapReducer, allCentresJson, initializeState)
   const mapRef = React.useRef<HTMLDivElement>(null)

   React.useEffect(() => {
      if (typeof DeviceOrientationEvent !== `undefined` && DeviceOrientationEvent.requestPermission) {
         DeviceOrientationEvent.requestPermission()
      }
      document.body.addEventListener(`mousemove`, ev => {
         cursorEv = ev
      })
      document.body.addEventListener(`keydown`, ev => {
         if (ev.key === `\\` && document.querySelector(`a-marker`)) {
            document.querySelector(`a-marker`).object3D.visible = !document.querySelector(`a-marker`).object3D.visible
         }
      })
   }, [])

   return (
      <Layout>
         <SEO title="Map of TEC | Coworking Space | Virtual Office">
            <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.min.js"></script>
            <link
               rel="stylesheet"
               href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.css"
               type="text/css"
            />
            <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
            {/* <script src="https://cdn.jsdelivr.net/npm/three.ar.js@latest/dist/three.ar.min.js"></script> */}
            <script src="https://jeromeetienne.github.io/AR.js/aframe/build/aframe-ar.min.js"></script>
            {/* <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script> */}
            {/* <script src="https://raw.githack.com/AR-js-org/studio-backend/master/src/modules/marker/tools/gesture-detector.js"></script> */}
            {/* <script src="https://raw.githack.com/AR-js-org/studio-backend/master/src/modules/marker/tools/gesture-handler.js"></script> */}
            {/* <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script> */}
            {/* <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script> */}
            {/* <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/a .js"></script> */}
            {/* <script src="https://supereggbert.github.io/aframe-htmlembed-component/dist/build.js"></script> */}
            {/* <script src="https://unpkg.com/@tensorflow/tfjs-core/dist/tf-core.js"></script> */}
            {/* <script src="https://unpkg.com/@tensorflow/tfjs-converter/dist/tf-converter.js"></script> */}

            {/* <script src="https://unpkg.com/@tensorflow/tfjs-backend-webgl/dist/tf-backend-webgl.js"></script> */}
            {/* <script src="https://unpkg.com/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js"></script> */}

            {/* <script src="https://unpkg.com/@tensorflow-models/handpose/dist/handpose.js"></script> */}
            <script src="https://cdn.jsdelivr.net/npm/handtrackjs/dist/handtrack.min.js"> </script>
         </SEO>
         <Scene />
         <MapContext.Provider value={{ state: mapState, dispatch: mapDispatch }}>
            <TecMap ref={mapRef}>
               <a href="/pattern-TEC.png" target="_blank" download="pattern-TEC.png" style={{ marginRight: `10px` }}>
                  Download Marker
               </a>
            </TecMap>
         </MapContext.Provider>
         {/* <HandTrack /> */}
      </Layout>
   )
}

export default ArPage

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
