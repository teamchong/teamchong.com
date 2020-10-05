import React from "react"

type Props = {
   siteTitle?: string
}

const Header: React.FC<Props> = ({ siteTitle = `` }) => (
   <header
      style={{
         background: `#002E5D`,
         marginBottom: `1.45rem`,
      }}
   >
      {siteTitle}
   </header>
)

export default Header
