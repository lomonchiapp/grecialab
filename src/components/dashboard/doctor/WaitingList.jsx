import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useGlobalState } from "../../../hooks/global/useGlobalState";
import { useUserState } from "../../../hooks/global/useUserState";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";
import { EmptyQueue } from "../common/EmptyQueue";

export const WaitingList = ({filteredTickets}) => {

  const { user } = useUserState();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const styles = {
    waitingList: {
      backgroundColor: colors.primary[400],
      padding: "5px",
      minHeight: "100%",
      borderRadius: "5px",
    },
    ticket: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 1,
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
    codeBox: {
      display: "flex",
      backgroundColor: colors.primary[400],
      color: colors.gray[100],
      padding: "5px",
      borderRadius: "5px",
      marginBottom: "5px",
    },
  };

  return (
    <Box sx={styles.waitingList}>
      <Box sx={styles.headerContainer}>
        <Typography sx={styles.header}>
          Pacientes en espera ({filteredTickets.length})
        </Typography>
      </Box>
      {filteredTickets.length === 0 ? (
        <Box sx={styles.emptyBox}>
          <EmptyQueue />
        </Box>
      ) : (
        filteredTickets.map((ticket) => (
          <Box sx={styles.ticket} key={ticket.id}>
            <Box sx={styles.codeBox}>
              <Typography variant="h6">{ticket.ticketCode}</Typography>
            </Box>
            <Box>
              <Typography variant="body1">{ticket.patientName}</Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};
