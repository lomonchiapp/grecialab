/* eslint-disable react/prop-types */
import React, {useEffect} from "react";
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DonutLargeOutlined,
  HelpOutlineOutlined,
  MapOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  ReceiptOutlined,
  TimelineOutlined,
  WavesOutlined,
} from "@mui/icons-material";
import avatar from "../../../assets/images/icon.png";
import logo from "../../../assets/images/logo-dark.png";
import Item from "./Item";
import { ToggledContext } from "../../../App";
import { Ticket, Users } from "@phosphor-icons/react";
import { Key } from "@mui/icons-material";
import { UsersFour } from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "../../../hooks/context/AuthProvider";
import { useUserState } from "../../../hooks/global/useUserState";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { role } = useAuth();
  const { user, fetchUser } = useUserState();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100%",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ":hover": { background: "transparent" } },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "10px 0 20px 0",
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >
                <img
                  style={{ width: "130px", borderRadius: "8px" }}
                  src={logo}
                  alt="Argon"
                />
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>
      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            mb: "25px",
          }}
        >
          <Avatar
            alt="avatar"
            src={avatar}
            sx={{ width: "100px", height: "100px" }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
              {user?.name}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="500"
              color={colors.cyanAccent[500]}
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: colors.cyanAccent[500],
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Panel Principal"
            path="/"
            colors={colors}
            icon={<DashboardOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Centro" : " "}
        </Typography>{" "}
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: colors.cyanAccent[500],
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Servicios"
            path="/services"
            colors={colors}
            icon={<PeopleAltOutlined />}
          />
          <Item
            title="Filas"
            path="/queues"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Tickets"
            path="/tickets"
            colors={colors}
            icon={<Ticket />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Configuraciones" : " "}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: colors.cyanAccent[400],
                background: "transparent",
                transition: ".4s ease",
              },
              ":active": {
                color: colors.cyanAccent[200],
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          {role === "admin" && (
            <Item
              title="Accesos"
              path="/users"
              colors={colors}
              icon={<UsersFour />}
            />
          )}
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
