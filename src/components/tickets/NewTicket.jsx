// React Imports
import React, { useState, useEffect, useRef } from "react";
// Mui Imports
import {
  Box, FormControl,
  TextField, Typography,
  Button, CircularProgress
} from "@mui/material";
// Global States
import { useGlobalState } from "../../hooks/global/useGlobalState";
import { useNewTicketState } from "../../hooks/global/useNewTicketState";
// Theme Imports
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
// Hooks
import { newTicket } from "../../hooks/tickets/newTicket";
import { handlePrint } from "../../hooks/tickets/print/handlePrint";
// Custom Components
import { TicketView } from "./TicketView";
import { ServiceSelection } from "./ServiceSelection";


export const NewTicket = ({ setOpen }) => {
  const { fetchQueues } = useGlobalState();
  const {selectedServices, selectedQueues, reset } = useNewTicketState();
  const [isPrinting, setIsPrinting] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const styles = {
    tktTxtLbl: {
      fontSize: "1rem",
      marginBottom: "10px",
    },
    ticketText: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.primary[100],
    },
    tktContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      border: `1px solid ${colors.primary[400]}`,
      backgroundColor: colors.gray[900],
      borderRadius: "5px",
      margin: "20px 0",
    },
    loadingBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      border: `1px solid ${colors.primary[400]}`,
      backgroundColor: colors.gray[900],
      borderRadius: "5px",
      margin: "20px 0",
    },
    loadingText:{
      color: colors.primary[100],
      marginLeft: "10px",
    },
    circProgress: {
      color: colors.primary[100],
    },
    dialog: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      border: `1px solid ${colors.primary[400]}`,
      backgroundColor: colors.gray[900],
      borderRadius: "5px",
      margin: "20px 0",
    },
  };

    // Update generatedTicket whenever selectedServices or selectedQueues change
    useEffect(() => {
      if (selectedServices.length > 0) {
        const count = selectedQueues[0]?.count || 0;
        const formattedCount = count.toString().padStart(2, "0");
        const ticketCode = `${selectedServices.map(service => service.name.slice(0, 1).toUpperCase()).join('')} - ${formattedCount}`;
        setGeneratedTicket(ticketCode);
      }
    }, [selectedServices, selectedQueues]);

  const [ticket, setTicket] = useState({
    patientName: "",
    services: [],
    queues:[],
    status: "pending", // 1 = pending
    ticketCode: generatedTicket,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const ticketRef = useRef();

 
  // Update ticketCode once generatedTicket is available
  useEffect(() => {
    if (generatedTicket) {
      setTicket(prevTicket => ({
        ...prevTicket,
        ticketCode: generatedTicket,
        services: selectedServices.map(service => ({
          id: service.id,
          name: service.name,
          status: "pending", // initial status for each service
        })),
        queues: selectedQueues.map(queue => (queue)),
      }));
    }
  }, [generatedTicket, selectedServices]);
 

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsPrinting(true);
    await newTicket(ticket, selectedQueues);
    fetchQueues();
    // Clean State
    setTicket({
      patientName: "",
      services: [],
      queues:[],
      status: "pending", // 1 = pending
      ticketCode: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setGeneratedTicket("");
    setSelectedServices([]);
    setSelectedQueues([]);
    await handlePrint(ticketRef);
    setIsPrinting(false);
    // Close Dialog
    setOpen(false);
    reset();
  };

  return (
    <Box sx={styles.dialog}>
    <Box sx={{width:"50%"}}>
      <Typography variant="h4">Nuevo Ticket</Typography>
      <FormControl fullWidth>
        <TextField
          label="Nombre de Paciente"
          variant="outlined"
          margin="normal"
          value={ticket.patientName || ''}
          onChange={(e) =>
            setTicket({ ...ticket, patientName: e.target.value })
          }
        />
        <ServiceSelection />
        <Box sx={styles.tktContainer}>
          <Typography sx={styles.tktTxtLbl}>Ticket #:</Typography>
          {selectedServices.length >= 1 && <Typography sx={styles.ticketText}>{generatedTicket}</Typography>}
        </Box>
        {isPrinting ? (
          <Box sx={styles.loadingBox}>
          <CircularProgress size={24} sx={styles.circProgress} />
          <Typography sx={styles.loadingText}>Imprimiendo.. Favor Espere...</Typography>
          </Box>
        )
         : (<Button
          variant="contained"
          color="primary"
          size="large"
          disabled={!selectedQueues}
          onClick={onSubmit}
        >
          Crear
        </Button>)}
      </FormControl>
    </Box>
    <Box ref={ticketRef}>
        <TicketView payload={ticket} />
    </Box>

    </Box>
  );
};
