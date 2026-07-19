import { NextSeo } from "next-seo"
import { MenuBuilder } from "@src/components/MenuBuilder/MenuBuilder"

export default function MenuBuilderPage() {
  return (
    <>
      <NextSeo title="Weekly Menu Builder" />
      <MenuBuilder />
    </>
  )
}
