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
  updateToCancelled,
  updateToFinished,
  updateToProcessing,
} from "../../../../hooks/tickets/updateTicket";
import { Check, CheckCircle, XCircle } from "@phosphor-icons/react";

export const ActualTicket = () => {
  const { tickets, fetchTickets, services } = useGlobalState();
  const { user } = useUserState();
  const [processingTicket, setProcessingTicket] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [enabledButton, setEnabledButton] = useState(false);

  useEffect(() => {
    const filteredTickets = tickets.filter(
      (ticket) =>
        ticket.status === "inQueue" && ticket.service === user?.service.id
    );
    if (filteredTickets.length > 0) {
      setEnabledButton(true)
    } else {
      setEnabledButton(false)
    }
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
      margin: "10px",
      backgroundColor: colors.gray[900],
      borderRadius: "5px",
    },
    ticketContainer: {
      padding: "10px",
      backgroundColor: colors.gray[800],
      borderRadius: "5px",
    },
    ticketCode: {
      color: colors.primary[100],
      fontFamily: "monospace",
      textAlign: "center",
      fontSize: "35px",
      fontWeight: "bold",
    },
    ticketHeader: {
      color: colors.primary[100],
      fontFamily: "monospace",
      textAlign: "center",
      border: `1px solid ${colors.gray[700]}`,
      mb:1,
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
      borderBottom: `1px solid ${colors.primary[400]}`,
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
      pl:2,
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
      fontSize: "24px",
      fontWeight: "bold",
    },
    helperText: {
      color: colors.primary[100],
      fontSize: "10px",
    },

  };

  useEffect(() => {
    if (user && user.service) {
      const filteredTickets = tickets.filter(
        (ticket) => ticket.service === user.service.id
      );
      const processingTicket = filteredTickets.find(
        (ticket) => ticket.status === "processing"
      );
      setProcessingTicket(processingTicket);

      console.log("tickets", filteredTickets);
    }
  }, [tickets, user]);

  const handleTakeTurn = async () => {
    if (user && user.service) {
      const firstInQueueTicket = tickets
        .filter(
          (ticket) =>
            ticket.status === "inQueue" && ticket.service === user.service.id
        )
        .sort((a, b) => a.createdAt - b.createdAt)[0];

      if (firstInQueueTicket) {
        await updateToProcessing(firstInQueueTicket.id, user, services);
        setProcessingTicket(firstInQueueTicket);
        fetchTickets();
      }
    }
  };

  const handleFinishTurn = async () => {
    if (processingTicket) {
      await updateToFinished(processingTicket.id, user);
      setProcessingTicket(null);
      fetchTickets();
    }
  };

  const handleCancelTurn = async () => {
    if (processingTicket) {
      await updateToCancelled(processingTicket.id, user);
      setProcessingTicket(null);
      fetchTickets();
    }
  };

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
            <Typography sx={styles.ticketHeader}>Paciente:</Typography>
            <Typography sx={styles.patientName}>{processingTicket.patientName}</Typography>
          </Box>
          </Box>
          
          <Box sx={styles.btnContainer}>
            <IconButton onClick={() => handleFinishTurn()}>
              <CheckCircle size={50} />
            </IconButton>
            <IconButton onClick={() => handleCancelTurn()}>
              <XCircle size={50} />
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
            onClick={() => handleTakeTurn()}
          >
            ATENDER PACIENTE
          </Button>
          {enabledButton && (
          <Typography sx={styles.helperText}>
            Espera a que algún paciente facture
          </Typography> ) 
          }
        </Box>
      )}
    </Box>
  );
};
