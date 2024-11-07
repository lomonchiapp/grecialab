import React, { useEffect, useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import { useGlobalState } from "../../../hooks/global/useGlobalState";
import { useUserState } from "../../../hooks/global/useUserState";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";

export const TotalTickets = () => {
  const { tickets } = useGlobalState();
  const { user } = useUserState();
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const totalTickets = tickets.filter((ticket) => {
    return ticket.services.some((service) =>
      user?.services?.some((userService) => userService.id === service.id)
    );
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const styles = {
    finishedTickets: {
      backgroundColor: colors.primary[400],
      padding: "15px",
      borderRadius: "5px",
      minHeight: "100%",
    },
    ticket: {
      padding: "10px",
      margin: "10px",
      backgroundColor: colors.gray[900],
      borderRadius: "5px",
    },
    header: {
      color: colors.primary[100],
      marginBottom: "10px",
      padding: "10px",
      fontSize: "14px",
      fontWeight: "bold",
    },
    headerContainer: {
      borderBottom: `1px solid ${colors.primary[400]}`,
      marginBottom: "10px",
    },
    qtyContainer:{
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: colors.primary[400],
    },
    qty:{
        color: colors.gray[100],
        fontFamily: 'monospace',
        padding: '5px',
        fontSize: '24px',
        borderRadius: '5px',
    }
  };

  return (
    <Card sx={styles.finishedTickets}>
      <Box sx={styles.headerContainer}>
        <Typography sx={styles.header}>Tickets Generados</Typography>
      </Box>
      <Box sx={styles.qtyContainer}>
        <Typography sx={styles.qty}>{totalTickets.length}</Typography>
      </Box>
    </Card>
  );
};
