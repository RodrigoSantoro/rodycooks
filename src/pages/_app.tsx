import type { AppProps } from 'next/app'
import { Layout } from '@src/components/Layout'
import '@src/styles/globals.css'
import Head from 'next/head'
import { ThemeProvider } from '@mui/material'
import { rodyCooksTheme } from '@src/styles/theme'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
                />
                <title>Rody Cooks</title>
            </Head>
            <ThemeProvider theme={rodyCooksTheme}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ThemeProvider>
        </>
    )
}
