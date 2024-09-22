import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Grid,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";
import { tokens } from "../../theme";
import { ServiceItem } from "../../components/services/ServiceItem";
import { NewDialog } from "../../components/NewDialog";
import { NewService } from "../../components/services/NewService";
import { useServiceState } from "../../hooks/global/useServiceState";

export const Services = () => {
  const [newService, setNewService] = useState(false)
  const { services, setServices, fetchQueues, fetchServices} = useServiceState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const refresh = () => {
    fetchServices()
    fetchQueues()
  }

  useEffect(() => {
    fetchServices()
    fetchQueues()
  },[])

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
          <Typography variant="h1">Servicios</Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            style={{
              backgroundColor: colors.primary[400],
              color: colors.gray[100],
            }}
            onClick={() => setNewService(true)}
          >
            Agregar Servicio
          </Button>
          <NewDialog open={newService} setOpen={setNewService}>
            <NewService setOpen={setNewService} refresh={refresh} />
          </NewDialog>
        </Box>
      </Box>
      <Box sx={styles.ServicesContainer}>
        {services.map((service, index) => (
          <ServiceItem
            key={index}
            service={service}
            queueId={service.queue}
            refresh={refresh}
          />
        ))}
      </Box>
    </Grid>
  );
};
