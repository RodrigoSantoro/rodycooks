import { Typography } from "@mui/material"
import { GetStaticProps } from "next"
import { Wine } from "@src/types/custom"
import { ParsedUrlQuery } from "querystring"
import { getAllWinePaths, getWineFromId } from "@src/utils/database"
import { WineView } from "@src/components/WineView/WineView"
import { NextSeo } from "next-seo"

interface Props {
  wine: Wine
}

export default function WinePage({ wine }: Props) {
  if (!wine) {
    return <Typography variant="h4">Wine not found</Typography>
  }

  return (
    <>
      <NextSeo title={wine.name} />
      <WineView wine={wine} />
    </>
  )
}

export async function getStaticPaths() {
  const paths = await getAllWinePaths()

  return { paths, fallback: false }
}

interface ContextParams extends ParsedUrlQuery {
  id: string
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as ContextParams

  const wine = await getWineFromId(id)

  return {
    props: { wine },
  }
}
