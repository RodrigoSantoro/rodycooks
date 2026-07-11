import { getAllWines } from "@src/utils/database"
import { NextSeo } from "next-seo"
import { Wine } from "@src/types/custom"
import { WineGrid } from "@src/components/WineGrid/WineGrid"

interface Props {
  wines: Wine[]
}

export default function WinesPage({ wines }: Props) {
  return (
    <>
      <NextSeo title="Wines" />
      <WineGrid wines={wines} />
    </>
  )
}

export async function getStaticProps() {
  const { wines } = await getAllWines()

  return {
    props: {
      wines,
    },
  }
}
