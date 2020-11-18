import React from "react"
import { Link, PageProps, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Card from "react-bulma-components/lib/components/card"
import Box from "react-bulma-components/lib/components/box"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
   site: {
      buildTime: string
   }
}
const vCardContent =
   "data:image/png;base64,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"

function AboutMe() {
   const myName: React.CSSProperties = {
      fontFamily: `Tahoma, 'Geneva', sans-serif`,
      textShadow: `2px 2px rgba(60, 60, 60, 0.2)`,
      fontSize: `2.6rem`,
      lineHeight: 1.04,
   }
   const pos: React.CSSProperties = {
      fontFamily: `Tahoma, 'Geneva', sans-serif`,
      fontSize: `0.9em`,
      color: `rgba(0, 0, 0, 0.54)`,
   }
   const aboutMe: React.CSSProperties = {
      margin: 0,
      padding: `10px 0 0 10px`,
      color: `#000`,
   }
   return (
      <Card.Content>
         <h3 style={myName}>Steven Chong</h3>
         <p style={pos}>- Developer @ Hong Kong</p>
         <blockquote style={aboutMe}>
            <p style={{marginTop:`0.5rem`}}>Proud father of my daughters.</p>
            <p style={{marginTop:`0.5rem`}}>Experienced software development professional.</p>
            <p style={{marginTop:`0.5rem`}}>Currently working @ <Link to="/tec/">The Executive Centre</Link></p>
         </blockquote>
      </Card.Content>
   )
}

function SocialBar() {
   const socialTitle: React.CSSProperties = {
      color: `#007bff`,
      fontFamily: `courier, 'courier new', monospace`,
      fontSize: `0.8em`,
   }
   return (
      <Card.Content>
         <div style={socialTitle}>
            <FontAwesomeIcon icon="angle-double-down" style={{ fontSize: `0.6em` }} />
            &nbsp; get in touch
         </div>
         <div className="line1" />
         <div className="social-links">
            <a href="https://facebook.com/chong1222" target="_blank" rel="noopener noreferrer">
               <FontAwesomeIcon icon={[`fab`, `facebook-square`]} />
            </a>
            <a href="https://github.com/teamchong" target="_blank" rel="noopener noreferrer">
               <FontAwesomeIcon icon={[`fab`, `github-square`]} />
            </a>
            <a href="https://linkedin.com/in/teamchong" target="_blank" rel="noopener noreferrer">
               <FontAwesomeIcon icon={[`fab`, `linkedin`]} />
            </a>
            <a href="https://wa.me/85290388912" target="_blank" rel="noopener noreferrer">
               <FontAwesomeIcon icon={[`fab`, `whatsapp-square`]} />
            </a>
            <a href="skype:hk90388912">
               <FontAwesomeIcon icon={[`fab`, `skype`]} style={{ marginTop: `5px` }} />
            </a>
            <a
               href={`mailto:${encodeURIComponent(`Steven Chong`)}<steven@teamchong.com>?subject=${encodeURIComponent(
                  `[TeamChong.com] New Message`
               )}`}
            >
               <FontAwesomeIcon icon="envelope-square" />
            </a>
         </div>
      </Card.Content>
   )
}

function AddMe() {
   function handlePopoverOpen(event: React.MouseEvent<HTMLElement>) {
      setAnchorEl(event.currentTarget)
   }

   function handlePopoverClose() {
      setAnchorEl(null)
   }

   const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
   const open = Boolean(anchorEl)

   const addMeButton: React.CSSProperties = {
      cursor: `pointer`,
      position: `absolute`,
      top: `25px`,
      left: `-50px`,
      transform: `rotate(-45deg)`,
      width: `200px`,
      background: `#007bff`,
      textAlign: `center`,
      lineHeight: `50px`,
      letterSpacing: 1,
      color: `#f0f0f0`,
      textDecoration: `none`,
      outline: `none`,
      border: `none`,
      opacity: 0.8,
   }

   const vCardQR: React.CSSProperties = {
      width: `200px`,
      height: `200px`,
      margin: `10px 0px 0px 0px`,
   }
   return (
      <>
         <button style={addMeButton} type="button" onMouseEnter={handlePopoverOpen}>
            <FontAwesomeIcon icon="address-card" /> add me
         </button>
         <Card className={`add-me ${open ? ` hover` : ``}`} onMouseLeave={handlePopoverClose}>
            <Card.Content>
               <div style={{
                  fontSize: `0.875rem`,
                  fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                  fontWeight: 400,
                  lineHeight: 1.43,
                  letterSpacing: `0.01071em`,
               }}>
                  <FontAwesomeIcon icon="qrcode"/> Scan QR code
               </div>
               <div>
                  <img src={vCardContent} alt="Scan QR code" style={vCardQR} />
               </div>
            </Card.Content>
            <Card.Footer>
               <Card.Footer.Item renderAs="a" href="StevenChong.vcf" download="StevenChong.vcf">
                  OR DOWNLOAD HERE.
               </Card.Footer.Item>
            </Card.Footer>
         </Card>
      </>
   )
}

const IndexPage: React.FC<PageProps<Props>> = ({ data: { site }, path }) => {
   function handleAddOil(e: React.MouseEvent<HTMLElement>) {
      setIsAddOil(!e.currentTarget.classList.contains(`hover`))
   }

   const [isAddOil, setIsAddOil] = React.useState<Boolean | null>(null)

   const root: React.CSSProperties = {
      color: `#000`,
      fontFamily: `Verdana, 'Geneva', sans-serif`,
      position: `fixed`,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      paddingTop: `40px`,
      paddingBottom: `50px`,
      paddingLeft: `10px`,
      paddingRight: `10px`,
      display: `flex`,
      alignItems: `center`,
      justifyContent: `center`,
   }

   const footer: React.CSSProperties = {
      position: `absolute`,
      color: `#666`,
      bottom: `0.5em`,
      right: `0.5em`,
      fontSize: `0.5em`,
   }
   return (
      <Layout>
         <SEO title={`Hello, I'm Steven`} />
         <Box style={root}>
            <Card className="my-card">
               <AboutMe />
               <SocialBar />
            </Card>

            <AddMe />
            <input
               type="image"
               className={`add-oil${isAddOil ? ` hover` : ``}`}
               onClick={handleAddOil}
               onMouseEnter={handleAddOil}
               onMouseOut={handleAddOil}
               src="/hkaddoil.png"
               alt="香港加油"
            />
            <div className="bg" />
            <div style={footer}>&copy; 2019 Steven Chong</div>
         </Box>
         hello word
      </Layout>
   )
}

export default IndexPage

export const query = graphql`
   {
      site {
         buildTime(formatString: "YYYY-MM-DD hh:mm a z")
      }
   }
`
