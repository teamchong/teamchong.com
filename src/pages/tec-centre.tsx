import React from "react"
import { PageProps, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Helmet from "react-helmet"
import styled from "styled-components"
import { Controller, Scene } from "react-scrollmagic"
import { Tween, Timeline } from "react-gsap"
import "../components/tec-centre.scss"

type Props = {
   pageContext: {
      address: string | null
      city: string | null
      currencyCode: string | null
      fax: string | null
      rooms: Array<{
         centre: string | null
         centreCode: string | null
         city: string | null
         websiteUrl: string | null
         file: string | null
         id: string | null
         market: string | null
         path: string | null
      }> | null
      id: string | null
      isActive: string | null
      isComingSoon: string | null
      latitude: string | null
      longitude: string | null
      name: string | null
      phone: string | null
      region: string | null
   }
}

function A({ tagName, ...props }) {
   return React.createElement(tagName, props)
}

const CentrePage: React.FC<PageProps<Props>> = ({
   pageContext: { address, city, currencyCode, fax, rooms, id, isActive, isComingSoon, latitude, longitude, name, phone, region },
}) => {
   const [state, setState] = React.useState({ scrollY: 0, innerHeight: 0 })
   React.useEffect(() => {
      function refresh() {
         setState({ scrollY: window.scrollY, innerHeight: window.innerHeight });
         requestAnimationFrame(refresh)
      }
      refresh()
   }, [])
   const l = React.useRef({ loaded: false })
   React.useEffect(() => {
      if (state.scrollY > state.innerHeight * 7) {
         var video = document.querySelector('#video-1')
         if (video) {
            if (!video.isPlaying) {
               video.play()
            }
         }  
      } else if (state.scrollY > state.innerHeight) {
         var video = document.querySelector('#video-1')
         if (video) {
            video.load()
         }
      }
   })
   let x = 0;
   let y = 0;
   let rate = 1 / 12;
   if (state.scrollY > state.innerHeight) {
      rate * 10;
   }
   // React.useEffect(() => {
   //    document.querySelector('#video-1').load()
   // }, [])
   return (
      <Layout>
         <SEO title={'POC - ' + name}></SEO>
         {/* <Helmet>
            {typeof window === 'undefined' && <script src="https://aframe.io/releases/1.1.0/aframe.min.js"></script>}
         </Helmet> */}
         <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <div style={{ width: "100vw", height: "100vh", position: "fixed", zIndex: -1 }}>
               <A
                  tagName="a-scene"
                  embedded
                  keyboard-shortcuts="enterVR: false"
                  vr-mode-ui="enabled: false"
                  inspector={false}
                  renderer="antialias: false; precision: low; alpha: false; physicallyCorrectLights: true; maxCanvasWidth: 800; maxCanvasHeight: 800;"
               >
                  <A tagName="a-assets">
                     {rooms?.map(({ path }, i) => (
                        i === 0 || i === 2 ? <img crossOrigin="" key={i} id={`img-${i}`} src={`/360/${path}`} /> : null
                     ))}
                     <video crossOrigin="" key="video-1" id="video-1" src={`/office360.mp4`} autoPlay={state.scrollY > state.innerHeight * 7} preload="true" loop={true} />
                  </A>
                  <A
                     tagName="a-sky"
                     src={state.scrollY > state.innerHeight * 7 ? '#video-1' : state.scrollY > state.innerHeight * 3 ? '#img-2' : '#img-0'}
                     look-controls
                     wasd-controls="enabled: true"
                     position={`${x} ${y} 0`}
                     rotation={`0 ${(state.scrollY * rate) % 360 - 120} 0`}
                  />
                  {/* <A tagName="a-camera"/> */}
               </A>
            </div>
            {/* <Tween
               staggerFrom={{ y: 50, visibility: "hidden", opacity: 0 }}
               staggerTo={{ y: 0, visibility: "visible", opacity: 1 }}
               stagger={1}
            ></Tween> */}
            <div style={{ width: "100vw", height: "100vh", pointerEvents: "none", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ background: 'rgba(255, 255, 255, 0.9)', width: '80vw', height: '30vh', borderRadius: '30px' }}>
                  <h1 style={{ fontSize: "110px", lineHeight: "30vh", textAlign: "center", color: "#369" }}>
                     POC - {name}
                  </h1>
               </div>
            </div>
            <div style={{ width: "100vw", height: "100vh", pointerEvents: "none", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ background: 'rgba(255, 255, 255, 0.9)', width: '80vw', height: '30vh', borderRadius: '30px' }}>
                  <h1 style={{ fontSize: "110px", lineHeight: "30vh", textAlign: "center", color: "#369" }}>
                     Reception
                  </h1>
               </div>
            </div>
            <div style={{ width: "100vw", height: "100vh", pointerEvents: "none", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ background: 'rgba(255, 255, 255, 0.9)', width: '80vw', height: '30vh', borderRadius: '30px' }}>
                  <h1 style={{ fontSize: "110px", lineHeight: "30vh", textAlign: "center", color: "#369" }}>
                     Coworking Area
                  </h1>
               </div>
            </div>
            <div style={{ width: "100vw", height: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center', background: "#fff" }}>
               <div style={{ background: 'rgba(255, 255, 255, 0.9)', width: '80vw', height: '30vh', borderRadius: '30px' }}>
                  <h1 style={{ fontSize: "110px", lineHeight: "30vh", textAlign: "center", color: "#369" }}>
                     {!!rooms && !!rooms[0] && <a href={rooms[0].websiteUrl}>Visit our website</a>}
                  </h1>
               </div>
            </div>
            <div style={{ width: "100vw", height: "300vh", pointerEvents: "none", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ background: 'rgba(255, 255, 255, 0.9)', width: '80vw', height: '30vh', borderRadius: '30px' }}>
                  <h1 style={{ fontSize: "110px", lineHeight: "30vh", textAlign: "center", color: "#369" }}>
                     Meeting Room
                  </h1>
               </div>
            </div>
            <div style={{ width: "100vw", height: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center', background: "#fff" }}>
               <div style={{ background: 'rgba(255, 255, 255, 0.9)', width: '80vw', height: '30vh', borderRadius: '30px' }}>
                  <h1 style={{ fontSize: "110px", lineHeight: "30vh", textAlign: "center", color: "#369" }}>
                     Also...
                  </h1>
               </div>
            </div>
            <div style={{ width: "100vw", height: "400vh", pointerEvents: "none", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ background: 'rgba(255, 255, 255, 0.9)', width: '80vw', height: '30vh', borderRadius: '30px' }}>
                  <h1 style={{ fontSize: "110px", lineHeight: "30vh", textAlign: "center", color: "#369" }}>
                     Video
                  </h1>
               </div>
            </div>
            <div style={{ width: "100vw", height: "100vh", display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
               {state.scrollY > state.innerHeight * 7 && <iframe src={'/tec/' + encodeURIComponent(id)} style={{width:'40vw',height:'40vh', marginTop: '10vh'}}></iframe>}
            </div>
         </div>
      </Layout>
   )
}

export default CentrePage
