import { Box, Typography, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const NotAllowed = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          flexDirection="column"
        >
          <Typography variant="h2">Oops, no deberías estar aquí...</Typography>
          <Typography variant="h4">Regresa a la página de inicio.</Typography>
          <Box mt={2}>
            <Button
              onClick={handleNavigateHome}
              variant="contained"
              color="primary"
            >
              Regresar
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};