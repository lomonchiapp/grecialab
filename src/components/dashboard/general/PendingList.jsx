import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, IconButton, Button, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useGlobalState } from "../../../hooks/global/useGlobalState";
import { useUserState } from "../../../hooks/global/useUserState";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";
import { EmptyQueue } from "../common/EmptyQueue";
import { useBillingState } from "../../../hooks/global/useBillingState";
import {
  ArrowRight,
  DotsThreeOutlineVertical,
  HandCoins,
  PersonSimpleWalk,
  XCircle,
} from "@phosphor-icons/react";
import {
  updateToProcessing,
  updateToCancelled,
} from "../../../hooks/tickets/updateTicket";
import { ArrowBack } from "@mui/icons-material";
import { ArrowForward } from "@mui/icons-material";

export const PendingList = () => {

  // Styles
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
    ticketNo: {
      fontWeight: "bold",
      fontFamily: "monospace",
    },
  };
  //Global States
  const { user } = useUserState();
  const { tickets, services } = useGlobalState();

  const initialTickets = tickets.filter((ticket) => ticket.status === "inQueue");
  const sortTickets = initialTickets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  //Local States
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage, setTicketsPerPage] = useState(5);
  const filteredTickets = selectedServices.length > 0
      ? sortTickets.filter((ticket) => selectedServices.includes(ticket.service))
      : sortTickets;
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const serviceName = (serviceId) => {
    const service = services.find((service) => service.id === serviceId);
    return service.name;
  }

  //Cambio de pagina
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const uniqueServices = [...new Set(services.map((service) => service.id))];

  // Handle checkbox change
  const handleCheckboxChange = (service) => {
    setSelectedServices(prevSelected =>
      prevSelected.includes(service)
        ? prevSelected.filter(s => s !== service)
        : [...prevSelected, service]
    );
  };


  return (
    <Box sx={styles.waitingList}>
      <Box sx={styles.headerContainer}>
        <Typography sx={styles.header}>
          Pacientes en espera ({filteredTickets.length})
        </Typography>
        {/* Filters */}
        <FormGroup row>
          {uniqueServices.map((service) => (
            <FormControlLabel
              key={service}
              control={
                <Checkbox
                  checked={selectedServices.includes(service)}
                  onChange={() => handleCheckboxChange(service)}
                />
              }
              label={serviceName(service)}
            />
          ))}
        </FormGroup>
      </Box>
      {currentTickets.length === 0 ? (
        <Box sx={styles.emptyBox}>
          <EmptyQueue />
        </Box>
      ) : (
        currentTickets.map((ticket) => (
          <Box sx={styles.ticket} key={ticket.id}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={styles.codeBox}>
                <Typography style={styles.ticketNo}>
                  {ticket.ticketCode}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1">{ticket.patientName}</Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
                disabled={ticket.status === "inQueue" ? false : true}
                onClick={() => updateToProcessing(ticket.id, user, services)}
              >
                <ArrowRight />
              </IconButton>
              <IconButton
                disabled={ticket.status === "inQueue" ? false : true}
                onClick={
                  () =>
                    updateToCancelled(
                      ticket.id,
                      user
                    ) /*BCancelled = Billed Cancelled */
                }
              >
                <XCircle />
              </IconButton>
            </Box>
          </Box>
        ))
      )}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <IconButton
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ArrowBack />
        </IconButton>
        {Array.from(
          { length: Math.ceil(sortTickets.length / ticketsPerPage) },
          (_, index) => (
            <Button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              variant={currentPage === index + 1 ? "contained" : "outlined"}
            >
              {index + 1}
            </Button>
          )
        )}
        <IconButton
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ArrowForward />
        </IconButton>
      </Box>
    </Box>
  );
};
