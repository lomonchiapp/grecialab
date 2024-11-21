import React from "react";
import { Box, IconButton, Typography, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
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
  const [processingTickets, setProcessingTickets] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [enabledButton, setEnabledButton] = useState(false);
  const [serviceSelectionOpen, setServiceSelectionOpen] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [pendingTicket, setPendingTicket] = useState(null);

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
      const currentProcessingTickets = tickets.filter(
        (ticket) =>
          ticket.services.some((service) =>
            user.services.some((userService) => 
              userService.id === service.id && 
              service.status === "processing"
            )
          )
      );
      setProcessingTickets(currentProcessingTickets);
    }
  }, [tickets, user]);

  const handleTakeTurn = async () => {
    const ticketToProcess = filteredTickets[0];
    const result = await updateToProcessing(ticketToProcess.id, user);
    
    if (result?.requiresSelection) {
      setAvailableServices(result.matchingServices);
      setPendingTicket(ticketToProcess);
      setServiceSelectionOpen(true);
    } else {
      fetchTickets();
    }
  };

  const handleServiceSelection = async (serviceId) => {
    await updateToProcessing(pendingTicket.id, user, serviceId);
    setServiceSelectionOpen(false);
    setPendingTicket(null);
    fetchTickets();
  };

  const handleFinishTurn = async (ticketId) => {
    await updateToFinished(ticketId, user);
    fetchTickets();
  };

  const handleCancelTurn = async (ticketId) => {
    await updateToCancelled(ticketId, user);
    fetchTickets();
  };

  const additionalStyles = {
    processingTicketsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "16px",
      marginBottom: "20px"
    },
    newPatientSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      marginTop: "20px",
      padding: "20px",
      borderTop: `1px solid ${colors.primary[400]}`
    },
    serviceName: {
      color: colors.greenAccent[500],
      fontSize: "14px",
      fontWeight: "bold",
      textAlign: "center",
      padding: "4px"
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.headerContainer}>
        <Typography sx={styles.header}>Pacientes en Atención</Typography>
      </Box>
      
      <Box sx={styles.processingTicketsContainer}>
        {processingTickets.map((ticket) => (
          <Box key={ticket.id} sx={styles.ticketContainer}>
            <Typography sx={styles.ticketHeader}>Ticket#:</Typography>
            <Typography sx={styles.ticketCode}>{ticket.ticketCode}</Typography>
            
            <Typography sx={styles.ticketHeader}>Paciente:</Typography>
            <Typography sx={styles.patientName}>{ticket.patientName}</Typography>
            
            <Typography sx={styles.ticketHeader}>Servicio en proceso:</Typography>
            {ticket.services.map((service) => 
              service.status === "processing" && (
                <Typography key={service.id} sx={styles.serviceName}>
                  {service.name}
                </Typography>
              )
            )}
            
            <Box sx={styles.btnContainer}>
              <IconButton onClick={() => handleFinishTurn(ticket.id)}>
                <CheckCircle size={32} />
              </IconButton>
              <IconButton onClick={() => handleCancelTurn(ticket.id)}>
                <XCircle size={32} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={styles.newPatientSection}>
        <Button
          disabled={!enabledButton}
          variant="contained"
          size="large"
          onClick={() => handleTakeTurn()}
        >
          ATENDER NUEVO PACIENTE
        </Button>
        {enabledButton && (
          <Typography sx={styles.helperText}>
            Hay pacientes esperando ser atendidos
          </Typography>
        )}
      </Box>

      <Dialog open={serviceSelectionOpen} onClose={() => setServiceSelectionOpen(false)}>
        <DialogTitle>Seleccione el servicio a atender:</DialogTitle>
        <List>
          {availableServices.map((service) => (
            <ListItem key={service.id}>
              <ListItemButton onClick={() => handleServiceSelection(service.id)}>
                <ListItemText primary={service.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Box>
  );
};
