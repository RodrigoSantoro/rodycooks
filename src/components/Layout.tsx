import { ReactElement } from 'react'
import { Navbar } from '@src/components/Navbar'
import { Box, Container } from '@mui/material'

type Props = {
    children: ReactElement
}

export const Layout = ({ children }: Props) => {
    return (
        <>
            <Navbar />
            <Box sx={{ height: 24 }} />
            <Container>{children}</Container>
        </>
    )
}
