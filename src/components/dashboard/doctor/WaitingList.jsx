import React, { useState } from "react";
import { Box, Typography, IconButton, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useGlobalState } from "../../../hooks/global/useGlobalState";
import { useUserState } from "../../../hooks/global/useUserState";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";
import { EmptyQueue } from "../common/EmptyQueue";
import { updateToProcessing, updateToCancelled } from "../../../hooks/tickets/updateTicket";
import { X, PersonSimpleWalk } from "@phosphor-icons/react";

export const WaitingList = ({filteredTickets}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { fetchTickets } = useGlobalState();
  const { user } = useUserState();

  const [serviceSelectionOpen, setServiceSelectionOpen] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [pendingTicket, setPendingTicket] = useState(null);

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
      justifyContent: "space-between",
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

  const handleTakeTurn = async (ticket) => {
    if (ticket.services.length > 1) {
      setAvailableServices(ticket.services);
      setPendingTicket(ticket);
      setServiceSelectionOpen(true);
    } else {
      const result = await updateToProcessing(ticket.id, user, ticket.services[0].id);
      fetchTickets();
    }
  };

  const handleServiceSelection = async (serviceId) => {
    await updateToProcessing(pendingTicket.id, user, serviceId);
    setServiceSelectionOpen(false);
    setPendingTicket(null);
    fetchTickets();
  };

  const handleCancelTurn = async (ticketId) => {
    await updateToCancelled(ticketId, user);
    fetchTickets();
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
            <Box sx={{display:"flex", alignItems:"center", gap:1}}>
            <Box sx={styles.codeBox}>
              <Typography variant="h6">{ticket.ticketCode}</Typography>
            </Box>
            <Box>
              <Typography variant="body1">{ticket.patientName}</Typography>
            </Box>
            </Box>
            <Box sx={{display:"flex", alignItems:"center", gap:1}}>
            <IconButton 
              onClick={() => handleTakeTurn(ticket)}
              aria-label="Atender paciente"
            >
              <PersonSimpleWalk />
            </IconButton>
            <IconButton 
              onClick={() => handleCancelTurn(ticket.id)}
              aria-label="Cancelar turno"
            >
                <X />
              </IconButton>
            </Box>
          </Box>
        ))
      )}
      <Dialog 
        open={serviceSelectionOpen} 
        onClose={() => setServiceSelectionOpen(false)}
        aria-labelledby="service-selection-dialog-title"
      >
        <DialogTitle id="service-selection-dialog-title">Seleccione el servicio a atender:</DialogTitle>
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

