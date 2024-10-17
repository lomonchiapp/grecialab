import React, { useState, useEffect, useRef } from "react";
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
import { TicketView } from "./TicketView";
import html2canvas from 'html2canvas';


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
    dialog: {
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
  };

  const [ticket, setTicket] = useState({
    patientName: "",
    service: "",
    status: "pending", // 1 = pending
    ticketCode: generatedTicket,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const ticketRef = useRef();

  const handlePrint = async () => {
    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current);
      const imgData = canvas.toDataURL('image/jpeg').split(',')[1]; // Get base64 string without the prefix

      // Create the payload
      const payload = {
        imagePath: `data:image/jpeg;base64,${imgData}`, // Send the base64 string directly
        imageWidth: 400,
        imageHeight: 1000,
      };

      // Send the image to the print server
      try {
        const response = await fetch('https://rndnj-181-36-66-5.a.free.pinggy.link/print', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log('Image sent to print server successfully');
        } else {
          console.error('Failed to send image to print server');
        }
      } catch (error) {
        console.error('Error sending image to print server:', error);
      }
    }
  };
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
    await handlePrint();
    setOpen(false);
  };

  return (
    <Box sx={styles.dialog}>
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
          required
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
    <Box ref={ticketRef}>
        <TicketView payload={ticket} />
    </Box>
    </Box>
  );
};