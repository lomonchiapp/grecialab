import React from 'react'
import { Box, Typography } from '@mui/material'
import { useGlobalState } from '../../../../hooks/global/useGlobalState'
import { useUserState } from '../../../../hooks/global/useUserState'
import { tokens } from '../../../../theme'
import { useTheme } from '@mui/material/styles'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button } from '@mui/material'
import { updateToCancelled, updateToFinished, updateToProcessing } from '../../../../hooks/tickets/updateTicket'


export const TakeTurn = () => {
  const { tickets, fetchTickets } = useGlobalState();
  const { user } = useUserState();
  const [processingTicket, setProcessingTicket] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: colors.gray[800],
      borderRadius: "10px",
    },
    ticket: {
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
  };

  useEffect(() => {
    if (user && user.service) {
      const filteredTickets = tickets.filter(ticket => ticket.service === user.service.id);
      const processingTicket = filteredTickets.find(ticket => ticket.status === 'processing');
      setProcessingTicket(processingTicket);

      console.log('tickets', filteredTickets);
    }
  }, [tickets, user]);

  const handleTakeTurn = async () => {
    if (user && user.service) {
      const firstInQueueTicket = tickets
        .filter(ticket => ticket.status === 'inQueue' && ticket.service === user.service.id)
        .sort((a, b) => a.createdAt - b.createdAt)[0];

      if (firstInQueueTicket) {
        await updateToProcessing(firstInQueueTicket.id, user);
        setProcessingTicket(firstInQueueTicket);
        fetchTickets();
      }
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.headerContainer}>
        <Typography sx={styles.header}>Estado Actual</Typography>
      </Box>
      {processingTicket ? (
        <Box sx={styles.ticket}>
          <Typography variant="h6">Código: {processingTicket.ticketCode}</Typography>
          <Typography variant="body1">Descripción: {processingTicket.description}</Typography>
          {/* Add more fields as necessary */}
        </Box>
      ) : (
        <Box>
          <Typography>No hay tickets en proceso</Typography>
          <Button variant='contained' onClick={() => handleTakeTurn()}>TOMAR PACIENTE</Button>
        </Box>
      )}
    </Box>
  );
};