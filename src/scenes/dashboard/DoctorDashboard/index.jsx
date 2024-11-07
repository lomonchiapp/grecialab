// React Imports
import React from "react";
// Material UI Imports
import { Box, Typography, Grid, Switch } from "@mui/material";
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
// Theme Imports
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

export const DoctorDashboard = () => {
  const theme = useTheme();
  const { tickets } = useGlobalState();
  const { user } = useUserState();

  // Step 1: Exclude tickets with services that are finished and match the user's services
  const relevantTickets = tickets.filter(
    (ticket) =>
      !ticket.services.some(
        (service) =>
          service.status === "finished" &&
          user?.services?.some((userService) => userService.id === service.id)
      )
  );

  // Step 2: Filter tickets with services that are inQueue and match the user's services
  const filteredTickets = relevantTickets.filter(
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
    },
  };
  return (
    <Grid sx={styles.dashboard} container spacing={2}>
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
