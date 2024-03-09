import type { AppProps } from 'next/app'
import { Layout } from '@src/components/Layout'
import '@src/styles/globals.css'
import Head from 'next/head'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'

export default function App({ Component, pageProps }: AppProps) {
    const theme = createTheme({
        typography: {
            fontFamily: 'Lato',
            allVariants: {
                color: '#333333',
            },
        },
        palette: {
            primary: {
                main: '#004686',
            },
        },
    })

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ThemeProvider>
        </>
    )
}
