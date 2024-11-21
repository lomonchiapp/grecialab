// React Imports
import React, { useState } from "react";
// Material UI Imports
import { Box, Typography, Grid, Switch, Button, IconButton } from "@mui/material";
// Global States
import { useGlobalState } from "../../../hooks/global/useGlobalState";
import { useUserState } from "../../../hooks/global/useUserState";
// Custom Components
import { WaitingList } from "../../../components/dashboard/doctor/WaitingList";
import { ActualTicket } from "../../../components/dashboard/doctor/ActualTicket";
import DoctorBillingQueue from "../../../components/dashboard/doctor/DoctorBillingQueue";
import { FinishedTickets } from "../../../components/dashboard/common/FinishedTickets";
import { CancelledTickets } from "../../../components/dashboard/common/CancelledTickets";
import { TotalTickets } from "../../../components/dashboard/common/TotalTickets";
import { LastTicket } from "../../../components/dashboard/common/LastTicket";
import { NewDialog } from "../../../components/NewDialog";
import { NewTicket } from "../../../components/tickets/NewTicket";
// Theme Imports
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { FilePlus } from "@phosphor-icons/react";

export const DoctorDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { tickets } = useGlobalState();
  const { user } = useUserState();
  const [newTicket, setNewTicket] = useState(false);

  // Filtrar tickets que tengan al menos un servicio pendiente que coincida con los servicios del usuario
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.status === "inQueue" && // General ticket status should be 'inQueue'
      ticket.services.some(
        (service) =>
          service.status === "pending" &&
          user?.services?.some((userService) => userService.id === service.id)
      )
  );

  const styles = {
    switchBox: {
      display: "flex",
      justifyContent: "flex-end",
      position: "absolute",
    },
    dashboard: {
      position: "relative",
      justifyContent: "space-between",
    },
    newTicketButton: {
      display: "flex",
      justifyContent: "flex-end",
    },
    newTicketIcon: {
      color: colors.greenAccent[500],
      backgroundColor: colors.gray[900],
      borderRadius: "5px",
      "&:hover": {
        backgroundColor: colors.gray[800],
      },
    },
  };
  return (
    <Grid sx={styles.dashboard} container spacing={2}>
      <Grid item xs={10}>
        <Typography variant="h4">Panel de Doctor</Typography>
        <Typography variant="subtitle1"> {user?.services?.map((service) => service.name).join(", ")}</Typography>
      </Grid>
      <Grid sx={styles.newTicketButton} item xs={2}>
        <IconButton sx={styles.newTicketIcon} onClick={() => setNewTicket(true)}>
          <FilePlus size={32} />
        </IconButton>
        <NewDialog open={newTicket} setOpen={setNewTicket}>
          <NewTicket setOpen={setNewTicket} />
        </NewDialog>
      </Grid>
      <Grid item xs={2}>
        <DoctorBillingQueue />
      </Grid>
      <Grid item xs={7}>
        <WaitingList filteredTickets={filteredTickets} />
      </Grid>
      <Grid item xs={3}>
        <ActualTicket filteredTickets={filteredTickets} />
      </Grid>
      <Grid item xs={3}>
        <FinishedTickets />
      </Grid>
      <Grid item xs={3}>
        <CancelledTickets />
      </Grid>
      <Grid item xs={3}>
        <TotalTickets />
      </Grid>
      <Grid item xs={3}>
        <LastTicket />
      </Grid>
    </Grid>
  );
};
