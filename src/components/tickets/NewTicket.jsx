import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  FormHelperText,
  MenuItem,
  Button,
  Select,
} from "@mui/material";
import { serverTimestamp } from "firebase/firestore";
import { useServiceState } from "../../hooks/global/useServiceState";
import { useQstate } from "../../hooks/global/useQstate";
import { database } from "../../firebase";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { newTicket } from "../../hooks/tickets/newTicket";
import { useGlobalState } from "../../hooks/global/useGlobalState";

export const NewTicket = ({ setOpen, refresh }) => {
  const { services, selectedQueue, setSelectedQueue, fetchQueues, queues } = useGlobalState();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const generatedTicket = `${selectedQueue?.name} - ${selectedQueue?.count?.toString().padStart(2, "0")}`;

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
  };

  const [ticket, setTicket] = useState({
    patientName: "",
    service: "",
    status: "pending", // 1 = pending
    ticketCode: generatedTicket,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    //Generate random alphanumeric string for ticket number:
    //number:
  });

    // Update ticketCode once generatedTicket is available
    useEffect(() => {
      if (generatedTicket) {
        setTicket(prevTicket => ({
          ...prevTicket,
          ticketCode: generatedTicket,
        }));
      }
    }, [generatedTicket]);
  

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    const correspondingService = services.find((service) => service.id === serviceId);
    const correspondingQueue = queues.find((queue) => queue.serviceId == serviceId);
    setTicket({ ...ticket, service: e.target.value });
    setSelectedQueue(correspondingQueue);
    console.log("queues availables:", queues);
    console.log("Selected Queue:", correspondingQueue);
    console.log("Selected Service:", correspondingService);
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    await newTicket(ticket, selectedQueue);
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4">Nuevo Ticket</Typography>
      <FormControl fullWidth>
        <TextField
          label="Nombre de Paciente"
          variant="outlined"
          margin="normal"
          value={ticket.patientName}
          onChange={(e) =>
            setTicket({ ...ticket, patientName: e.target.value })
          }
        />
        <Select
          label="Servicio"
          variant="outlined"
          margin="normal"
          value={ticket.service}
          onChange={handleServiceChange}
        >
          {services.map((service, index) => (
            <MenuItem key={index} value={service.id}>
              {service.name}
            </MenuItem>
          ))}
        </Select>
        <Box sx={styles.tktContainer}>
          <Typography sx={styles.tktTxtLbl}>Ticket #:</Typography>
          {selectedQueue && <Typography sx={styles.ticketText}>{generatedTicket}</Typography>}
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={!selectedQueue}
          onClick={onSubmit}
        >
          Crear
        </Button>
      </FormControl>
    </Box>
  );
};
