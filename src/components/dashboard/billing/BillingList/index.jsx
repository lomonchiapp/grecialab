import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { useGlobalState } from "../../../../hooks/global/useGlobalState";
import { useUserState } from "../../../../hooks/global/useUserState";
import { tokens } from "../../../../theme";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import {
  updateToBilled,
  updateToBCancelled,
  updateToBilling,
} from "../../../../hooks/tickets/updateTicket";
import { Check, CheckCircle, XCircle } from "@phosphor-icons/react";
import { useBillingState } from "../../../../hooks/global/useBillingState";

export const BillingList = () => {
  const { tickets, subscribeToTickets } = useGlobalState();
  const { user } = useUserState();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [enabledButton, setEnabledButton] = useState(false);
  const [billingTickets, setBillingTickets] = useState([]);

  const handleBilling = async (ticketId) => {
    await updateToBilled(ticketId, user);
  };

  const handleBCancel = async (ticketId) => {
    await updateToBCancelled(ticketId, user);

  };

  const handleTakeTurn = async () => {
    const nextTicket = tickets.filter((ticket) => ticket.status === "pending").
      sort((a, b) => a.createdAt - b.createdAt)[0];
    await updateToBilling(nextTicket.id, user);
  };

  useEffect(() => {
    const unsubscribe = subscribeToTickets();
    return () => unsubscribe();
  }, [subscribeToTickets]);
 
  useEffect(() => {
    setBillingTickets(tickets.filter((ticket) => ticket.status === 'billing'));
  }, [tickets]);

  const styles = {
    container: {
      padding: "10px",
      backgroundColor: colors.cyanAccent[900],
      borderRadius: "10px",
      minHeight: "100%",
      border: `2px solid ${colors.gray[100]}`,
    },
    ticket: {
      padding: "10px",
      flexDirection: "row",
      display: "flex",
      justifyContent: "space-between",
      margin: "10px",
      backgroundColor: colors.gray[800],
      borderRadius: "5px",
    },
    ticketContainer: {
      padding: "10px",
      display: "flex",
      flexDirection: "row",
      backgroundColor: colors.gray[500],
      borderRadius: "5px",
    },
    ticketCode: {
      color: colors.primary[100],
      fontFamily: "monospace",
      textAlign: "center",
      fontSize: "14px",
      fontWeight: "bold",
    },
    ticketHeader: {
      color: colors.primary[100],
      fontFamily: "monospace",
      mb: 1,
      fontSize: "14px",
      fontWeight: "bold",
    },
    header: {
      color: colors.primary[100],
      marginBottom: "10px",
      padding: "10px",
      fontSize: "14px",
      fontWeight: "bold",
    },
    headerContainer: {
      marginBottom: "10px",
    },
    btnContainer: {
      display: "flex",
      justifyContent: "space-around",
      paddingTop: "10px",
    },
    patientContainer: {
      padding: "10px",
      mt: "10px",
      border: `1px solid ${colors.primary[400]}`,
      borderRadius: "5px",
    },
    patientName: {
      color: colors.primary[100],
      fontSize: "14px",
      fontWeight: "bold",
      fontFamily: "monospace",
      pl: 2,
    },
    patientLabel: {
      color: colors.primary[100],
      fontSize: "14px",
      fontWeight: "bold",
    },
    idleBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
    },
    idleText: {
      color: colors.primary[100],
      fontSize: "14px",
      fontWeight: "bold",
    },
    helperText: {
      color: colors.primary[100],
      fontSize: "10px",
    },
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.headerContainer}>
        <Typography sx={styles.header}>Facturación</Typography>
      </Box>
      {billingTickets.length > 0 ? (
        billingTickets.map((ticket) => (
          <Box sx={styles.ticket} key={ticket.id}>
            <Box>
              <Box>
                <Typography sx={styles.ticketHeader}>
                  {ticket.ticketCode}
                </Typography>
              </Box>
              <Box>
                <Typography sx={styles.ticketHeader}>
                  {ticket.patientName}
                </Typography>
              </Box>
            </Box>

            <Box sx={styles.btnContainer}>
              <IconButton onClick={() => handleBilling(ticket.id)}>
                <CheckCircle size={50} />
              </IconButton>
              <IconButton onClick={() => handleBCancel(ticket.id)}>
                <XCircle size={50} />
              </IconButton>
            </Box>
          </Box>
        ))
      ) : (
        <Box sx={styles.idleBox}>
          <Typography sx={styles.idleText}>Puesto Libre</Typography>
          <Button
            disabled={enabledButton}
            variant="contained"
            size="large"
            onClick={() => handleTakeTurn()}
          >
            ATENDER PACIENTE
          </Button>
          {enabledButton && (
            <Typography sx={styles.helperText}>
              Espera a que algún paciente facture
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
