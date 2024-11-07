import React, { useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../hooks/context/AuthProvider"
import { InstallForm } from "../../components/install/InstallForm";

export const Install = () => {
  const navigate = useNavigate();
  const theme = createTheme();
  const colors = tokens(theme.palette.mode);


  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          minWidth: "100vw",
          background: 'radial-gradient(circle, #0B1767, #1E67C7)',
        }}
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <Box
          sx={{
            backgroundColor: "white",
            padding: "30px",
            display: "flex",
            borderRadius: "25px",
            maxWidth: "600px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src="logo.jpg" alt="logo" style={{ width: "400px" }} />
          <InstallForm />
        </Box>
      </Container>
    </ThemeProvider>
  );
};
