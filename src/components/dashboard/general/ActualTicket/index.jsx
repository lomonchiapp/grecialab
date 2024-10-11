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
  updateToProcessing,
  updateToFinished,
  updateToCancelled,
} from "../../../../hooks/tickets/updateTicket";
import { Check, CheckCircle, XCircle } from "@phosphor-icons/react";
import { useBillingState } from "../../../../hooks/global/useBillingState";

export const ActualTicket = () => {
  // Estilos
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const styles = {
    container: {
      padding: "10px",
      backgroundColor: colors.gray[900],
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
      backgroundColor: colors.gray[700],
      borderRadius: "5px",
    },
    ticketContainer: {
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.cyanAccent[800],
      borderRadius: "5px",
    },
    ticketCode: {
      color: colors.primary[100],
      fontFamily: "monospace",
      textAlign: "center",
      fontSize: "34px",
      fontWeight: "bold",
    },
    ticketHeader: {
      color: colors.primary[100],
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
  // Estado Global
  const { tickets, subscribeToTickets, services } = useGlobalState();
  const { user } = useUserState();
  // Estado Local
  const [enabledButton, setEnabledButton] = useState(false);
  const [processingTicket, setProcessingTicket] = useState(null);

  const handleFinishTurn = async () => {
    await updateToFinished(processingTicket.id, user);
  };

// Helper function to filter tickets by status
const filterTicketsByStatus = (tickets, status) => {
  return tickets.filter(ticket => ticket.status === status);
};

// Helper function to sort tickets by creation date
const sortTicketsByCreationDate = (tickets) => {
  return tickets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

// Function to get the next ticket in queue
const getNextTicketInQueue = (tickets) => {
  const inQueueTickets = filterTicketsByStatus(tickets, "inQueue");
  const sortedTickets = sortTicketsByCreationDate(inQueueTickets);
  return sortedTickets[0];
};

const handleTakeNext = async () => {
  try {
    const nextTicket = getNextTicketInQueue(tickets);

    if (nextTicket) {
      await updateToProcessing(nextTicket.id, user, services);
      setProcessingTicket(nextTicket);
      console.log(`Processing ticket with ID: ${nextTicket.id}`);
      console.log(processingTicket)
    } else {
      console.warn("No tickets in queue");
    }
  } catch (error) {
    console.error("Error taking next ticket:", error);
  }
};

  useEffect(() => {
    const unsubscribe = subscribeToTickets();
    return () => unsubscribe();
  }, [subscribeToTickets]);

  useEffect(() => {
    const filteredTickets = tickets.filter((ticket) => {
      console.log("Ticket Status:", ticket.status);
      return ticket.status === "inQueue";
    });
    if (filteredTickets.length > 0) {
      setEnabledButton(true);
    } else {
      setEnabledButton(false);
    }
  }, [tickets, user]);

  const handleFinish = async (ticketId) => {
    await updateToFinished(ticketId, user);
  };

  useEffect(() => {
    if (user) {
      const filteredTickets = tickets.filter(
        (ticket) => ticket.status === "processing"
      );
      const processingTicket = filteredTickets.find(
        (ticket) => ticket.user?.id === user.id
      );
      setProcessingTicket(processingTicket);

      console.log("tickets", filteredTickets);
    }
  }, [tickets, user]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.headerContainer}>
        <Typography sx={styles.header}>Estado Actual</Typography>
      </Box>
      {processingTicket ? (
        <Box>
          <Box sx={styles.ticketContainer}>
            <Box>
              <Typography sx={styles.ticketHeader}>Ticket#:</Typography>
            </Box>
            <Typography sx={styles.ticketCode}>
              {processingTicket.ticketCode}
            </Typography>
            <Box>
              <Typography sx={styles.patientName}>
                {processingTicket.patientName}
              </Typography>
            </Box>
          </Box>

          <Box sx={styles.btnContainer}>
            <IconButton onClick={() => updateToFinished(processingTicket.id, user)}>
              <CheckCircle size={75} />
            </IconButton>
            <IconButton onClick={() => updateToCancelled(processingTicket.id, user)}>
              <XCircle size={75} />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box sx={styles.idleBox}>
          <Typography sx={styles.idleText}>Puesto Libre</Typography>
          <Button
            disabled={!enabledButton}
            variant="contained"
            size="large"
            onClick={() => handleTakeNext()}
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
