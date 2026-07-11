import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const baseTheme = createTheme({
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

// Automatically scales heading sizes down on smaller screens.
export const rodyCooksTheme = responsiveFontSizes(baseTheme)
