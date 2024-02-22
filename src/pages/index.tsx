import { supabase } from '@src/lib/supabaseClient'
import { Dish, Dishes } from '@src/types/custom'
import Link from 'next/link'
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table'
import { useMemo } from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

interface Props {
    dishes: Dishes
}

export default function HomePage({ dishes }: Props) {
    const categories = useMemo(() => {
        const categories = new Set<string>()
        dishes.forEach((dish) => {
            dish.categories.forEach((category) => {
                categories.add(category)
            })
        })
        return Array.from(categories)
    }, [dishes])

    const columns = useMemo<MRT_ColumnDef<Dish>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                enableHiding: false,
                Cell: ({ cell }) => (
                    <Link
                        href={`recipes/${cell.row.original.url}`}
                        target="_blank"
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        {cell.getValue<string>()}
                        <OpenInNewIcon sx={{ pl: 1, fontSize: 12 }} />
                    </Link>
                ),
            },
            {
                accessorKey: 'categories',
                id: 'categories',
                header: 'Categories',
                Cell: ({ cell }) => (
                    <>{cell.getValue<string[]>().sort().join(', ')}</>
                ),
                filterVariant: 'multi-select',
                filterSelectOptions: categories.sort(),
            },
        ],
        [categories]
    )

    const table = useMaterialReactTable({
        columns,
        data: dishes,
        enableHiding: false,
    })

    return <MaterialReactTable table={table} />
}

export async function getStaticProps() {
    const { data, error } = await supabase.from('view_name').select('*')
    const dishes = new Map()
    data?.forEach((dish) => {
        if (dishes.get(dish.dish_id)) {
            dishes.get(dish.dish_id).categories.push(dish.cat_name)
        } else {
            dishes.set(dish.dish_id, {
                id: dish.dish_id,
                name: dish.dish_name,
                url: dish.url,
                categories: [dish.cat_name],
            })
        }
    })

    if (error) {
        console.error(error.message)
        return { props: {} }
    }

    return {
        props: {
            dishes: Array.from(dishes.values()),
        },
    }
}
