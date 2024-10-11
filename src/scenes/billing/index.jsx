import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { tokens } from "../../theme";
import { PositionItem } from "../../components/billing/PositionItem";
import { NewDialog } from "../../components/NewDialog";
import { NewBillingPosition } from "../../components/billing/NewBillingPosition";
import { useGlobalState } from "../../hooks/global/useGlobalState";

export const Billing = () => {
  const [newBillingPosition, setNewBillingPosition] = useState(false)
  const { billingPositions, fetchBillingPositions } = useGlobalState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const styles = {
    page: {
      padding: "40px",
      backgroundColor: colors.background,
    },
    ServicesContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "20px",
    },
  };
  return (
    <Grid sx={styles.page}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h1">Puestos de Facturación</Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            style={{
              backgroundColor: colors.primary[400],
              color: colors.gray[100],
            }}
            onClick={() => setNewBillingPosition(true)}
          >
            Agregar Puesto de Facturación
          </Button>
          <NewDialog open={newBillingPosition} setOpen={setNewBillingPosition}>
            <NewBillingPosition setOpen={setNewBillingPosition}/>
          </NewDialog>
        </Box>
      </Box>
      <Box sx={styles.ServicesContainer}>
        {billingPositions.map((position, index) => (
          <PositionItem
            key={index}
            billingPosition={position}
          />
        ))}
      </Box>
    </Grid>
  );
};
