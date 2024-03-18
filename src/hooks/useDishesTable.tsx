import { Dish } from '@src/types/custom'
import Link from 'next/link'
import { useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { Typography } from '@mui/material'

export const useDishesTable = (dishes: Dish[], categories: string[]) => {
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
                        style={{ fontSize: '16px' }}
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
                    <Typography>
                        {cell.getValue<string[]>().sort().join(', ')}
                    </Typography>
                ),
                filterVariant: 'multi-select',
                filterSelectOptions: categories.sort(),
                size: 100,
            },
            {
                accessorKey: 'prepTime',
                id: 'prepTime',
                header: 'Prep Time (minutes)',
                size: 50,
                Cell: ({ cell }) => (
                    <Typography>{cell.getValue<string>()}</Typography>
                ),
            },
            {
                accessorKey: 'cookTime',
                id: 'cookTime',
                header: 'Cook Time (minutes)',
                size: 50,
                Cell: ({ cell }) => (
                    <Typography>{cell.getValue<string>()}</Typography>
                ),
            },
        ],
        [categories]
    )

    const table = useMaterialReactTable({
        columns,
        data: dishes,
        enableHiding: false,
    })

    return table
}
