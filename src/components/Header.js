import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Menu,
  Tooltip,
  Avatar,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon, AutoGraphTwoTone } from "@mui/icons-material";
import Session from "../store/session";
import useStore from "../store/store";
import Confirm from "./Confirm";

const LinkBehavior = React.forwardRef((props, ref) => (
  <Link ref={ref} to={props.href} {...props} />
));

const Logo = ({ display }) => (
  <>
    <AutoGraphTwoTone fontSize="large" sx={{ display: display, mr: 1 }} />
    <Typography
      variant="h6"
      noWrap
      component={LinkBehavior}
      href="/"
      sx={{
        mr: 2,
        display: display,
        fontFamily: "monospace",
        fontWeight: 700,
        letterSpacing: ".2rem",
        color: "inherit",
        textDecoration: "none",
        "&:hover": { color: "#fff" },
      }}
    >
      {process.env.REACT_APP_NAME}
    </Typography>
  </>
);

function Header() {
  const navigate = useNavigate();
  const { user } = useStore((state) => state);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleLogout = () => {
    Session.logout();
    window.location.href = "/login";
  };

  return (
    <>
      <Confirm
        open={openConfirmDialog}
        onNo={() => setOpenConfirmDialog(false)}
        onYes={() => {
          setOpenConfirmDialog(false);
          handleLogout();
        }}
        title="Want to logout?"
        body="You'll be logged out from the application."
      />
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Logo display={{ xs: "none", md: "flex" }} />
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem
                  key={"home"}
                  onClick={() => {
                    navigate("/");
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center">Home</Typography>
                </MenuItem>
                <MenuItem
                  key={"profile"}
                  onClick={() => {
                    navigate("/profile");
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem
                  key={"manage"}
                  onClick={() => {
                    navigate("/manage");
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center">Manage</Typography>
                </MenuItem>
                <MenuItem
                  key={"users"}
                  onClick={() => {
                    navigate("/users");
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center">Users</Typography>
                </MenuItem>
                <MenuItem
                  key={"payments"}
                  onClick={() => {
                    navigate("/payments");
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center">Payments</Typography>
                </MenuItem>
                <MenuItem
                  key={"searches"}
                  onClick={() => {
                    navigate("/searches");
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center">Searhces</Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Logo display={{ xs: "flex", md: "none" }} />
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
              }}
            >
              <Button
                key="home"
                onClick={() => {
                  navigate("/");
                  handleCloseNavMenu();
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Home
              </Button>
              <Button
                key="manage"
                onClick={() => {
                  navigate("/manage");
                  handleCloseNavMenu();
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Manage
              </Button>
              <Button
                key="users"
                onClick={() => {
                  navigate("/users");
                  handleCloseNavMenu();
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Users
              </Button>
              <Button
                key="payments"
                onClick={() => {
                  navigate("/payments");
                  handleCloseNavMenu();
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Payments
              </Button>
              <Button
                key="searches"
                onClick={() => {
                  navigate("/searches");
                  handleCloseNavMenu();
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Searches
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Profile">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.name} src="not-found.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  key="profile"
                  onClick={() => {
                    navigate("/profile");
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem
                  key="settings"
                  onClick={() => {
                    navigate("/settings");
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Settings</Typography>
                </MenuItem>
                <MenuItem
                  key="logout"
                  onClick={() => {
                    setOpenConfirmDialog(true);
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Header;
