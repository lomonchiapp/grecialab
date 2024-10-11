import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  ClickAwayListener,
} from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";
import { useContext } from "react";
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  NotificationsOutlined,
  PersonOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { ToggledContext } from "../../../App";
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { Notifications } from "../../../components/notifications/Notifications";

const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const isXsDevices = useMediaQuery("(max-width:466px)");
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleClickAway = () => {
    handleNotificationsClose();
  };

  const handleLogout = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        console.log("Logged out successfully");
        navigate("/login");
        handleMenuClose();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error logging out", error);
      });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
          onClick={() => setToggled(!toggled)}
        >
          <MenuOutlined />
        </IconButton>
      </Box>

      <Box>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined />
          ) : (
            <DarkModeOutlined />
          )}
        </IconButton>
        <IconButton onClick={handleNotificationsOpen}>
          <NotificationsOutlined />
          
          <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        PaperProps={{
          style: {
            maxHeight: '400px',
            width: '300px',
          },
        }}
        BackdropProps={{
          invisible: true,
        }}
      >
        <Notifications />
      </Menu>

        </IconButton>
        <IconButton>
          <SettingsOutlined />
        </IconButton>
        <IconButton onClick={handleMenuOpen}>
          <PersonOutlined />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
