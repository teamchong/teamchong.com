import React from "react"
import { PageProps, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
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

const CentrePage: React.FC<PageProps<Props>> = ({
   pageContext: {
      address,
      city,
      currencyCode,
      fax,
      rooms,
      id,
      isActive,
      isComingSoon,
      latitude,
      longitude,
      name,
      phone,
      region
   }
}) => {  
   const h = React.createElement
   let angleX = -130;
   let angleY = 0;
   return (
      <Layout>
         <SEO title={name} />
         <div style={{width:'100vw',height:'100vh'}}>
            {h('a-scene', {key:'a-scene',embedded:true,["keyboard-shortcuts"]:"enterVR: false",["vr-mode-ui"]:"enabled: false",inspector:false},
               h('a-assets', null, [
                  ...(rooms ? rooms.map(({
                     centre,
                     centreCode,
                     city,
                     websiteUrl,
                     file,
                     id,
                     market,
                     path
                  }, i) => 
                     <React.Fragment key={id}>
                        {/* <div> */}
                           {/* <label style={{padding:'10px',display:'block',textAlign:'right'}}>
                           <input type="checkbox" checked={!!autoPlay} style={{marginRight:'10px'}} onChange={autoPlayHandler}/>
                           Auto Play?
                           </label> */}
                           {/* <div style={{position:'fixed',width:'30vw',height:'30vh',zIndex:2}}> */}
                              {/* h('a-assets', null, countryList.filter(img => 0 == img.indexOf(params.country) && 0 <= img.indexOf('/' + building + '/') ).map((img, i) => */}
                              {h('img', {key:'img-' + i,id: 'img-' + i, src: `/360/${path}`})}
                              {/* h('a-sky', {key:'a-sky'+encodeURI(loc),src: '#img-'+countryList.filter(img => 0 == img.indexOf(params.country) && 0 <= img.indexOf('/' + building + '/') ).indexOf(loc), rotation: "0 " + angleX + " " + angleY}), */}
                              {/* {h('a-sky', {key:'a-sky'+encodeURI(id),src: '#img-0', rotation: "0 " + (window.scrollY/10 % 360) + " " + angleY})} */}
                           {/* </div> */}
                        {/* </div> */}
                        {/* <hr/>
                        <div style={{ width: '100vw' }}>
                           <iframe src={websiteUrl} style={{outline:'1px solid #ccc',marginLeft:'10px',marginTop:'10px',width:'100vw',height:'8000px',background:'transparent'}}></iframe>
                        </div> */}
                     </React.Fragment>
                  ) : []),
                  h('a-sky', {key:'a-sky'+encodeURI(id),src: '#img-0', rotation: "0 " + (window.scrollY/10 % 360) + " " + angleY})
               ])
            )}
         </div>
      </Layout>
   )
}

export default CentrePage

export const query = graphql`
   {
      site {
         buildTime(formatString: "YYYY-MM-DD hh:mm a z")
      }
   }
`
