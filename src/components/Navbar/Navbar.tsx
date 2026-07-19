import React, { useState } from "react"
import { useRouter } from "next/router"

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
  ListItemIcon,
} from "@mui/material"

import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import LocalDiningIcon from "@mui/icons-material/LocalDining"
import HomeRoundedIcon from "@mui/icons-material/HomeRounded"
import WineBarRoundedIcon from "@mui/icons-material/WineBarRounded"
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded"
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded"

const pages = [
  { label: "Home", path: "/", icon: <HomeRoundedIcon /> },
  { label: "Meal Plan", path: "/mealplans", icon: <RestaurantMenuRoundedIcon /> },
  {
    label: "Menu Builder",
    path: "/menu-builder",
    icon: <EditCalendarRoundedIcon />,
  },
  { label: "Wines", path: "/wines", icon: <WineBarRoundedIcon /> },
]

export const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const router = useRouter()

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer)
  }

  const isActive = (path: string) =>
    path === "/" ? router.pathname === "/" : router.pathname.startsWith(path)

  return (
    <AppBar position="static" color="primary">
      <Container>
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 96 } }}>
          <LocalDiningIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "common.white",
              textDecoration: "none",
            }}
          >
            RODY COOKS
          </Typography>
          <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1 }}>
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
              slotProps={{
                paper: {
                  sx: {
                    width: 280,
                    boxSizing: "border-box",
                    borderTopRightRadius: 16,
                    borderBottomRightRadius: 16,
                    backgroundColor: "#ffffff",
                  },
                },
              }}
            >
              {/* Branded header — ties the drawer to the blue app bar */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2.5,
                  py: 2.5,
                  color: "common.white",
                  background:
                    "linear-gradient(135deg, #004686 0%, #0a5aa8 100%)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LocalDiningIcon />
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{ fontWeight: 700, letterSpacing: 0.5 }}
                    color="common.white"
                  >
                    Rody Cooks
                  </Typography>
                </Box>
                <IconButton
                  onClick={toggleDrawer}
                  aria-label="close menu"
                  sx={{ color: "common.white" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <List sx={{ px: 1.5, py: 2 }}>
                {pages.map((page) => {
                  const active = isActive(page.path)
                  return (
                    <ListItem key={page.path} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        component="a"
                        href={page.path}
                        onClick={toggleDrawer}
                        selected={active}
                        sx={{
                          borderRadius: 2,
                          py: 1.25,
                          color: active ? "primary.main" : "text.primary",
                          "&.Mui-selected": {
                            backgroundColor: "rgba(0, 70, 134, 0.08)",
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor: "rgba(0, 70, 134, 0.14)",
                          },
                          "&:hover": {
                            backgroundColor: "rgba(0, 70, 134, 0.06)",
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 40,
                            color: active ? "primary.main" : "text.secondary",
                          }}
                        >
                          {page.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={page.label}
                          slotProps={{
                            primary: {
                              sx: { fontWeight: active ? 700 : 500 },
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  )
                })}
              </List>
            </Drawer>
          </Box>
          <LocalDiningIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              color: "common.white",
              textDecoration: "none",
            }}
          >
            Rody Cooks
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "end",
              ml: 4,
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.path}
                component="a"
                href={page.path}
                sx={{ my: 2, color: "white", display: "block" }}
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
