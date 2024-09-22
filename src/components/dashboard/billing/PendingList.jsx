import React from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import { useGlobalState } from "../../../hooks/global/useGlobalState";
import { useUserState } from "../../../hooks/global/useUserState";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";
import { EmptyQueue } from "../common/EmptyQueue";
import { useBillingState } from "../../../hooks/global/useBillingState";
import {
  DotsThreeOutlineVertical,
  HandCoins,
  PersonSimpleWalk,
  XCircle,
} from "@phosphor-icons/react";
import { updateToBilled, updateToBilling } from "../../../hooks/tickets/updateTicket";

export const PendingList = () => {
  const { user } = useUserState();
  const { setBillingTickets, billingTickets } = useBillingState();
  const { tickets } = useGlobalState();
  const filteredTickets = tickets.filter(
    (ticket) => ticket.status === "pending"
  );
  const sortTickets = filteredTickets.sort((a, b) => a.createdAt - b.createdAt);
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
      justifyContent: "space-between",
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
      {sortTickets.length === 0 ? (
        <Box sx={styles.emptyBox}>
          <EmptyQueue />
        </Box>
      ) : (
        sortTickets.map((ticket) => (
          <Box sx={styles.ticket} key={ticket.id}>
            <Box>
              <Box sx={styles.codeBox}>
                <Typography variant="h6">{ticket.ticketCode}</Typography>
              </Box>
              <Box>
                <Typography variant="body1">{ticket.patientName}</Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
              disabled={ticket.status === "pending" ? false : true}
                onClick={() => updateToBilling(ticket.id, user)}
              >
                <HandCoins />
              </IconButton>
              <IconButton
                disabled={ticket.status === "pending" ? false : true}
                onClick={
                  () => updateToBCancelled(ticket.id, user) /*BCancelled = Billed Cancelled */
                }
              >
                <XCircle />
              </IconButton>
              {ticket.status === "billing" && (
                <Box>
                  <Typography>Facturando</Typography>
                </Box>
              )}
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};
