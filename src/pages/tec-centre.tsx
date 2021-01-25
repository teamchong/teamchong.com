import React from "react"
import { PageProps, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import "aframe"
import styled from "styled-components"
import { Controller, Scene } from "react-scrollmagic"
import { Tween, Timeline } from "react-gsap"

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
   const [state, setState] = React.useState({ scrollY: 0 })
   React.useEffect(() => {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = `
body { overflow: visible; }
#___gatsby{ position: static !important; }`;
      document.querySelector('head').appendChild(style);
      window.addEventListener('scroll', (ev) => {
         setState({ scrollY: window.scrollY });
      })
   }, [])
   let angleX = -130
   let angleY = 0
   const container = React.useRef(null)
   return (
      <Layout>
         <SEO title={name}>
         </SEO>
         <div style={{ width: "100vw", height: "100vh", position: "relative" }} ref={container}>
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
                        <img key={i} id={`img-${i}`} src={`/360/${path}`} />
                     ))}
                  </A>
                  <A
                     tagName="a-sky"
                     src="#img-0"
                     look-controls
                     wasd-controls="enabled: true"
                     position="0 0 0"
                     rotation={`0 ${(state.scrollY / 10) % 360} ${angleY}`}
                  />
                  {/* <A tagName="a-camera"/> */}
               </A>
            </div>
            {/* <Tween
               staggerFrom={{ y: 50, visibility: "hidden", opacity: 0 }}
               staggerTo={{ y: 0, visibility: "visible", opacity: 1 }}
               stagger={1}
            ></Tween> */}
            {/* {!!container.current && <Controller container={container.current}> */}
            <div style={{ opacity: 0.9, width: "100vw", height: "100vh", pointerEvents: "none", whiteSpace: "nowrap" }}>
               <h1 style={{ fontSize: "110px", lineHeight: "100vh", textAlign: "center", width: "100vw", color: "#fff", position: "absolute" }}>
                  {name}
               </h1>
               <h1 style={{ fontSize: "100px", lineHeight: "100vh", textAlign: "center", width: "100vw", color: "#039", position: "absolute" }}>
                  {name}
               </h1>
            </div>
            <div style={{ opacity: 0.9, width: "100vw", height: "100vh", pointerEvents: "none" }}>
               <h1 style={{ fontSize: "31px", lineHeight: "100vh", textAlign: "center", width: "100vw", color: "#fff", position: "absolute" }}>
                  {address}
               </h1>
               <h1 style={{ fontSize: "30px", lineHeight: "100vh", textAlign: "center", width: "100vw", color: "#039" }}>{address}</h1>
            </div>
            {/* </Controller>} */}
         </div>
      </Layout>
   )
}

export default CentrePage
