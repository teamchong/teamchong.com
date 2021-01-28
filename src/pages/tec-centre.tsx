import React from "react"
// import { PageProps, graphql } from "gatsby"
import { PageProps } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
// import Helmet from "react-helmet"
// import styled from "styled-components"
// import { Controller, Scene } from "react-scrollmagic"
// import { Tween, Timeline } from "react-gsap"
// import "../components/tec-centre.scss"
// import { ScrollToPlugin } from "gsap/all"
import "aframe"

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

type ScrollState = {
   roomLength: number
   offset: number
   scrollY: number
   innerHeight: number
   playVideo: boolean
}

type State = ScrollState

type UpdateScrollAction = {
   type: `UPDATE_SCROLL`
   payload: Partial<ScrollState>
}

type Action = UpdateScrollAction

function reducer(state: State, action: Action) {
   switch (action.type) {
      case `UPDATE_SCROLL`:
         const { scrollY, innerHeight } = action.payload
         const offset = ~~((scrollY + innerHeight) / innerHeight / 4)
         const playVideo = state.playVideo || offset >= state.roomLength;
         if (offset === state.offset && scrollY === state.scrollY && innerHeight === state.innerHeight && playVideo === state.playVideo) {
            return state
         }
         return { ...state, offset, scrollY, innerHeight, playVideo }
      default:
         throw new Error()
   }
}

function A({ tagName, ...props }) {
   return React.createElement(tagName, props)
}

const CentrePage: React.FC<PageProps<Props>> = ({
   pageContext: { address, city, currencyCode, fax, rooms, id, isActive, isComingSoon, latitude, longitude, name, phone, region },
}) => {
   const [{ scrollY, innerHeight, playVideo, offset }, dispatch] = React.useReducer(reducer, { offset: 0, roomLength: rooms ? rooms.length : 0, scrollY: 0, innerHeight: 0, playVideo: false })
   React.useEffect(() => {
      function refresh() {
         dispatch({ type: "UPDATE_SCROLL", payload: { scrollY: window.scrollY, innerHeight: window.innerHeight } })
         requestAnimationFrame(refresh)
      }
      refresh()
   }, [])
   const videoRef = React.useRef<HTMLVideoElement>(null)
   // React.useEffect(() => {
   //    if (!videoRef.current ){
   //       dispatch({ type: 'UPDDATE_VIDEO_STATE', payload: { playVideo: false } })
   //    }
   //    else if (!videoRef.current.getAttribute('data-initialized')) {
   //       videoRef.current.addEventListener('canplaythrough', () => {
   //          dispatch({ type: 'UPDDATE_VIDEO_STATE', payload: { playVideo: true } })
   //       })
   //       videoRef.current.setAttribute('data-initialized', "true")
   //       // videoRef.current.play()
   //    }
   // })
   let x = 0
   let y = 0
   let rate = 360 / innerHeight / 3
   return (
      <Layout>
         <SEO title={name}></SEO>
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
                        i + 1 >= offset && offset >= i - 1 &&
                        <img crossOrigin="use-credentials" key={i} id={`img-${i}`} src={`/360/${path}`} />
                     ))}
                     {playVideo && <video
                        ref={videoRef}
                        muted={true}
                        crossOrigin="use-credentials"
                        key="video-1"
                        id="video-1"
                        src={`/office360.mp4`}
                        autoPlay={true}
                        preload="true"
                        loop={true}
                     />}
                  </A>
                  <A
                     tagName="a-sky"
                     src={offset >= rooms?.length ? "#video-1" : `#img-${offset}`}
                     look-controls
                     wasd-controls="enabled: true"
                     position={`${x} ${y} 0`}
                     rotation={`0 ${((scrollY * rate) % 360) - 110} 0`}
                  />
                  {/* <A tagName="a-camera"/> */}
               </A>
            </div>
            {/* <div style={{position:'fixed',top:0}}>
               scrollY: {scrollY},
               innerHeight: {innerHeight},
               offset: {offset},
               rooms?.length: {rooms?.length},
            </div> */}
            {/* <Tween
               staggerFrom={{ y: 50, visibility: "hidden", opacity: 0 }}
               staggerTo={{ y: 0, visibility: "visible", opacity: 1 }}
               stagger={1}
            ></Tween> */}
            <div style={{ width: "100vw", height: "100vh", display: "flex", pointerEvents: "none", justifyContent: "center", alignItems: "center" }}>
               <div style={{ background: "rgba(255, 255, 255, 0.9)", borderRadius: "30px", pointerEvents: "auto", padding: "30px" }}>
                  <h1 style={{ fontSize: "5rem", textAlign: "center", color: "#369" }}>{name}</h1>
                  <p style={{ display: "flex", justifyContent: "space-between" }}>{address}</p>
                  <div style={{ border: "1px solid #ccc", borderRadius: "10px", margin: "10px auto" }}>
                     <p style={{ display: "flex", justifyContent: "space-between", padding: "5px", paddingRight: "50%" }}>
                        {!!phone && (
                           <>
                              <span>Phone</span> <span>{phone}</span>
                           </>
                        )}
                     </p>
                     <p style={{ display: "flex", justifyContent: "space-between", padding: "5px", paddingRight: "50%" }}>
                        {!!fax && (
                           <>
                              <span>Fax</span> <span>{fax}</span>
                           </>
                        )}
                     </p>
                  </div>
                  {!!rooms && !!rooms[0] && (
                     <a href={rooms[0].websiteUrl} target="_blank">
                        {rooms[0].websiteUrl}
                     </a>
                  )}
                  <div style={{ textAlign: "center", margin: "5px" }}>
                     <a
                        className="button is-link"
                        style={{ width: "100%" }}
                        href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`}
                        target="_blank"
                     >
                        Street View
                     </a>
                  </div>
                  <div style={{ textAlign: "center", margin: "5px" }}>
                     <a
                        className="button is-link"
                        style={{ width: "100%" }}
                        href={`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(city)}`}
                        target="_blank"
                     >
                        Transportation
                     </a>
                  </div>
                  {!!isComingSoon && <h3 style={{ textAlign: "center" }}>Coming Soon...</h3>}
               </div>
            </div>
            <div style={{ width: "100vw", height: "100vh", pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center" }}>
               {!!rooms && !!rooms[0] && <div style={{ background: "rgba(255, 255, 255, 0.9)", pointerEvents: "auto", borderRadius: "30px", padding: "20px 100px" }}>
                  <h1 style={{ fontSize: "80px", lineHeight: "1", textAlign: "center", color: "#369" }}>{rooms[0].id}</h1>
               </div>}
            </div>
            <div style={{ width: "100vw", height: "100vh", pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
            {!!rooms && rooms.filter((room, i) => i > 0).map((room, i) => <React.Fragment key={i}>
               <div style={{ width: "100vw", height: "100vh", display: "flex", pointerEvents: "auto", justifyContent: "center", alignItems: "center", background: "#fff" }}>
                  <h1 style={{ fontSize: "80px", lineHeight: "1", textAlign: "center", color: "#369" }}>{room.id}</h1>
               </div>
               <div style={{ width: "100vw", height: "100vh", pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
               <div style={{ width: "100vw", height: "100vh", pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ background: "rgba(255, 255, 255, 0.9)", pointerEvents: "auto", borderRadius: "30px", padding: "20px 100px" }}>
                     <h1 style={{ fontSize: "80px", lineHeight: "1", textAlign: "center", color: "#369" }}>Html content here</h1>
                  </div>
               </div>
               <div style={{ width: "100vw", height: "100vh", pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
            </React.Fragment>)}
            <div style={{ width: "100vw", height: "100vh", display: "flex", pointerEvents: "none", justifyContent: "center", alignItems: "center", background: "#fff", overflow: "hidden" }}>
               {offset >= rooms?.length && (
                  // !playVideo ? (
                  //    <div style={{ width: "100vw", height: "100vh", pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center", position: 'fixed', top: 0, left: 0 }}>
                  //       <div style={{ background: "rgba(255, 255, 255, 0.9)", borderRadius: "30px", padding: "20px 100px" }}>
                  //          <h1 style={{ fontSize: "80px", lineHeight: "1", textAlign: "center", color: "#369" }}>Loading Video...</h1>
                  //       </div>
                  //    </div>
                  // ) : (
                     <h1 style={{ fontSize: "80px", lineHeight: "1", pointerEvents: "auto", textAlign: "center", color: "#369" }}>
                        Video
                     </h1>
                  // )
               )}
            </div>
            <div style={{ width: "100vw", height: "300vh", pointerEvents: "none", display: "flex", justifyContent: "flex-start", alignItems: "flex-end" }}>
               {/* <iframe src={"/tec/" + encodeURIComponent(id)} style={{ width: "40vw", height: "40vh", marginTop: "10vh" }}></iframe> */}
            </div>
         </div>
      </Layout>
   )
}

export default CentrePage
