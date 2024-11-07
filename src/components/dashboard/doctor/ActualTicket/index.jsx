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

export const ActualTicket = ({filteredTickets}) => {
  const { tickets, fetchTickets, services } = useGlobalState();
  const { user } = useUserState();
  const [processingTicket, setProcessingTicket] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [enabledButton, setEnabledButton] = useState(false);

  useEffect(() => {

    if (filteredTickets.length >= 1) {
      setEnabledButton(true);
    } else {
      setEnabledButton(false);
    }
  }, [filteredTickets, user]);

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
    if (user && user.services) {
      const processingTicket = tickets.find(
        (ticket) =>
          ticket.status === "processing" &&
          ticket.user.authId === user.authId &&
          ticket.services.some((service) =>
            user.services.some((userService) => userService.id === service.id)
          )
      );

      setProcessingTicket(processingTicket);

      console.log("Processing Ticket:", processingTicket);
    }
  }, [tickets, user]);

const handleTakeTurn = () => {
    const filteredTickets = tickets.filter(
      (ticket) => {
        return (
          ticket.status === "inQueue" &&
          ticket.services.some((service) =>
            user?.services?.some((userService) => userService.id === service.id)
          )
        );
      }
    );

    if (filteredTickets.length > 0) {
      const ticketToProcess = filteredTickets[0];
      setProcessingTicket(ticketToProcess);
      // Update the ticket status to "processing" or any other logic you need
      updateToProcessing(ticketToProcess.id, user, services);
      console.log("Processing Ticket:", ticketToProcess);
    } else {
      console.log("No tickets available for processing");
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
