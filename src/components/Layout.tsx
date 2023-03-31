import { ReactElement } from 'react'
import { Navbar } from '@src/components/Navbar'

type Props = {
    children: ReactElement
}

export const Layout = ({ children }: Props) => {
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    )
}
