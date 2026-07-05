import React, { useState } from 'react'

import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    Container,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import LocalDiningIcon from '@mui/icons-material/LocalDining'

const pages = [{ label: 'Home', path: '/' }]

export const Navbar = () => {
    const [openDrawer, setOpenDrawer] = useState(false)

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer)
    }

    return (
        <AppBar
            position="static"
            style={{
                height: 120,
                backgroundColor: 'primary.main',
                justifyContent: 'center',
            }}
        >
            <Container>
                <Toolbar disableGutters>
                    <LocalDiningIcon
                        sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        RODY COOKS
                    </Typography>
                    <Box display={{ xs: 'flex', md: 'none' }} flexGrow={1}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={toggleDrawer}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="left"
                            open={openDrawer}
                            onClose={toggleDrawer}
                            sx={{
                                width: 240,
                                flexShrink: 0,
                                '& .MuiDrawer-paper': {
                                    width: 240,
                                    boxSizing: 'border-box',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0 1',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <IconButton onClick={toggleDrawer}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <Divider />
                            <List>
                                {pages.map((page) => (
                                    <ListItem key={page.path} disablePadding>
                                        <ListItemButton
                                            component="a"
                                            href={page.path}
                                        >
                                            <ListItemText
                                                primary={page.label}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Drawer>
                    </Box>
                    <LocalDiningIcon
                        sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Rody Cooks
                    </Typography>
                    <Box
                        flexGrow={1}
                        display={{ xs: 'none', md: 'flex' }}
                        justifyContent="end"
                        ml={4}
                    >
                        {pages.map((page) => (
                            <Button
                                key={page.path}
                                component="a"
                                href={page.path}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.label}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
