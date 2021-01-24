import React from "react"
import { PageProps, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

type Props = {
   site: {
      buildTime: string
   }
}

const CentrePage: React.FC<PageProps<Props>> = ({ data: { site }, path }) => {
   return (
      <Layout>
         <SEO title={`Hello, I'm Steven`} />
         <div>
            test
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
