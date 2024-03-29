import { Dish } from '@src/types/custom'
import { MaterialReactTable } from 'material-react-table'
import { useDishesTable } from '@src/hooks/useDishesTable'
import { getDishesWithCategories } from '@src/utils/database'
import { NextSeo } from 'next-seo'

interface Props {
    dishes: Dish[]
    categories: string[]
}

export default function HomePage({ dishes, categories }: Props) {
    const table = useDishesTable(dishes, categories)

    return (
        <>
            <NextSeo title="Home" />
            <MaterialReactTable table={table} />
        </>
    )
}

export async function getStaticProps() {
    const { dishes, categories } = await getDishesWithCategories()

    return {
        props: {
            dishes,
            categories,
        },
    }
}
