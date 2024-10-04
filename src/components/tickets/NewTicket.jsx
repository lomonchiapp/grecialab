import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  MenuItem,
  Button,
  Select,
} from "@mui/material";
import { serverTimestamp } from "firebase/firestore";
import { useGlobalState } from "../../hooks/global/useGlobalState";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { newTicket } from "../../hooks/tickets/newTicket";
import axios from "axios";

export const NewTicket = ({ setOpen }) => {
  const { services, selectedQueue, setSelectedQueue, fetchQueues, queues, tickets } = useGlobalState();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const generatedTicket = `${selectedQueue?.name} - ${selectedQueue?.count?.toString().padStart(2, "0")}`;
  const pendingTickets = tickets.filter((ticket) => ticket.status === "pending");
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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

  const handlePrint = async () => {
    try {
      const serviceName = services.find((service) => service.id === ticket.service);
      const createdAt = new Date(ticket.createdAt);
  
      const formattedDate = createdAt.toLocaleDateString('en-GB'); // Format date as DD/MM/YYYY
      const formattedTime = createdAt.toLocaleTimeString('en-GB'); // Format time as HH:MM:SS
  
      const payload = {
        patientName: ticket.patientName,
        service: serviceName.name,
        ticketCode: ticket.ticketCode,
        pplBefore: pendingTickets.length,
        date: formattedDate,
        time: formattedTime,
      };
      console.log('Payload:', payload); // Log the payload to verify its structure
  
      const response = await fetch('http://localhost:3000/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Text sent successfully:', responseData);
      } else {
        console.error('Error sending text:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending text:', error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await newTicket(ticket, selectedQueue);
    await handlePrint();
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
          value={ticket.patientName || ''}
          onChange={(e) =>
            setTicket({ ...ticket, patientName: e.target.value })
          }
        />
        <Select
          label="Servicio"
          variant="outlined"
          margin="normal"
          value={ticket.service || ''}
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