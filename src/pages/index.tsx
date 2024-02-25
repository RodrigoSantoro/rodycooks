import { supabase } from '@src/lib/supabaseClient'
import { Dish, Dishes } from '@src/types/custom'
import Link from 'next/link'
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table'
import { useMemo } from 'react'
// import { Button } from '@mui/material'

interface Props {
    dishes: Dishes
    categories: string[]
}

export default function HomePage({ dishes, categories }: Props) {
    // const addToCart = (cell: any) => {
    //     console.log(cell)
    // }

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
                    >
                        {cell.getValue<string>()}
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
                size: 100,
            },
            {
                accessorKey: 'prepTime',
                id: 'prepTime',
                header: 'Prep Time',
                size: 50,
            },
            {
                accessorKey: 'cookTime',
                id: 'cookTime',
                header: 'Cook Time',
                size: 50,
            },
            // {
            //     accessorKey: 'addToCart',
            //     header: '',
            //     Cell: ({ cell }) => (
            //         <Button onClick={() => addToCart(cell)}>Add to card</Button>
            //     ),
            //     enableSorting: false,
            //     enableColumnActions: false,
            // },
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
    const { data, error } = await supabase
        .from('dishes_with_categories_view')
        .select('*')
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
                prepTime: dish.prep_time,
                cookTime: dish.cook_time,
            })
        }
    })

    const categoriesSet = new Set<string>()
    dishes.forEach((dish) => {
        dish.categories.forEach((category: string) => {
            categoriesSet.add(category)
        })
    })
    const categories = Array.from(categoriesSet)

    if (error) {
        console.error(error.message)
        return { props: {} }
    }

    return {
        props: {
            dishes: Array.from(dishes.values()),
            categories,
        },
    }
}
