import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { tokens } from "../../theme";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../hooks/context/AuthProvider"
import { getUserRole } from "../../utils/roles/getUserRole";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const theme = createTheme();
  const colors = tokens(theme.palette.mode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userRole = await getUserRole(email);
      if (!userRole) {
        setError('No role found for this email');
        return;
      }
      setRole(userRole);

      // Proceed with authentication
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log('User logged in with role:', userRole);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to log in');
    }
  };



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
          backgroundColor: "#0B1767",
        }}
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            display: "flex",
            maxWidth: "400px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src="icon.png" alt="logo" style={{ width: "100px" }} />
          <Typography component="h1" variant="h5">
            Acceder al Sistema
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Acceder
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
