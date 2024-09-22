import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { database } from "../../firebase";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useGlobalState } from "../../hooks/global/useGlobalState";

export const QueueBox = ({ queue }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [serviceNames, setServiceNames] = useState({});
  const styles = {
    headerContainer: {
      display: "flex",
      position: "relative",
      justifyContent: "start",
      alignItems: "center",
      padding: "20px",
      backgroundColor: colors.primary[400],
      borderRadius: "5px",
      marginBottom: "10px",
    },
    headerContActive: {
      display: "flex",
      position: "relative",
      justifyContent: "start",
      alignItems: "center",
      padding: "20px",
      backgroundColor: colors.cyanAccent[600],
      borderRadius: "5px",
      marginBottom: "10px",
    },
    qNameContainer: {
      position: "absolute",
      right: 0,
      top: 0,
      padding: "8px",
      backgroundColor: colors.cyanAccent[600],
      borderRadius: "5px",
    },
    qNameContActive: {
      position: "absolute",
      right: 0,
      top: 0,
      padding: "8px",
      backgroundColor: colors.cyanAccent[200],
      borderRadius: "5px",
    },

    qName: {
      color: colors.primary[100],
      fontSize: "16px",
      fontWeight: "bold",
    },
    qNameActive: {
      color: colors.primary[500],
      fontSize: "16px",
      fontWeight: "bold",
    },
    listContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "13px",
      mb: "20px",
      border: `1px solid ${colors.primary[400]}`,
      borderRadius: "5px",
      backgroundColor: colors.gray[900],
    },
    listContActive: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "13px",
      mb: "20px",
      border: `1px solid ${colors.cyanAccent[700]}`,
      borderRadius: "5px",
      backgroundColor: colors.gray[900],
    },
    list: {
      width: "100%",
      minHeight: "175px",
      maxWidth: "380px",
    },
    listItem: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      px: "10px",
      border: `3px dashed ${colors.primary[400]}`,
      borderRadius: "5px",
      marginBottom: "10px",
      backgroundColor: colors.gray[800],
    },
    inProcessBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      px: "10px",
      border: `2px dashed ${colors.gray[400]}`,
      borderRadius: "5px",
      marginBottom: "20px",
      backgroundColor: colors.cyanAccent[700],
    },
    itemText: {
      fontSize: "1rem",
      fontWeight: "bold",
      mr: 1,
      color: colors.primary[100],
    },
    emptyBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
    ticketCode: {
      color: colors.primary[100],
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    patientName: {
      color: colors.primary[100],
      fontSize: "13px",
    },
    timeAgo: {
      color: colors.cyanAccent[300],
      fontSize: "12px",
      px: "3px",
      backgroundColor: colors.gray[700],
    },
    lenContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "8px",
      mb: "20px",
      border: `1px solid ${colors.primary[400]}`,
      borderRadius: "5px",
      backgroundColor: colors.gray[900],
    },
    lenText: {
      color: colors.primary[100],
      fontSize: "1rem",
    },
  };
  const { tickets, subscribeToTickets, services } = useGlobalState();
  const ticketsInQueue = tickets.filter(
    (ticket) =>
      ticket.status === "inQueue" && ticket.service === queue.serviceId
  );
  const ticketInProcess = tickets.find(
    (ticket) =>
      ticket.status === "processing" && ticket.service === queue.serviceId
  );

  useEffect(() => {
    // Map service IDs to service names
    const servicesMap = services.reduce((acc, service) => {
      acc[service.id] = service.name;
      return acc;
    }, {});
    setServiceNames(servicesMap);
  }, [services]);

  useEffect(() => {
    const unsubscribe = subscribeToTickets();
    return () => unsubscribe();
  }, [subscribeToTickets]);

  const timeSince = (date) => {
    let parsedDate;
    if (date instanceof Timestamp) {
      parsedDate = date.toDate();
    } else if (typeof date === "string" || date instanceof String) {
      parsedDate = new Date(date);
    } else if (date instanceof Date) {
      parsedDate = date;
    } else {
      return "Invalid date";
    }

    if (isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    const now = new Date();
    const seconds = Math.floor((now - parsedDate) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " años";

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " meses";

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " días";

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hrs";

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " min";

    return Math.floor(seconds) + " segs";
  };
  return (
    <Box>
      <Box sx={queue.isMain ? styles.headerContActive : styles.headerContainer}>
        <Box sx={queue.isMain ? styles.qNameContActive : styles.qNameContainer}>
          <Typography sx={queue.isMain ? styles.qNameActive : styles.qName}>
            {queue.name}
          </Typography>
        </Box>

        <Typography variant="h4">{serviceNames[queue.service]}</Typography>
      </Box>

      <Box sx={queue.isMain ? styles.listContActive : styles.listContainer}>
        <List sx={styles.list}>
          {ticketsInQueue.length === 0 && (
            <ListItem>
              <Box sx={styles.emptyBox}>
                <Typography sx={styles.itemText}>
                  No hay nadie en la cola
                </Typography>
              </Box>
            </ListItem>
          )}
          <Box sx={styles.lenContainer}>
            <Typography sx={styles.lenText} variant="h6">
              Personas en cola: {ticketsInQueue.length}
            </Typography>
          </Box>
          {ticketInProcess ? (
            <Box sx={styles.inProcessBox}>
              <Box sx={styles.ticketCodeActive}>
                {ticketInProcess.ticketCode}
              </Box>
              <Box>
                <Typography sx={styles.patientName}>
                  Paciente: {ticketInProcess.patientName}
                </Typography>
              </Box>
            </Box>
          ) : null}
          {ticketsInQueue.map((ticket, index) => (
            <>
              <ListItem sx={styles.listItem} key={index}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography sx={styles.ticketCode}>
                    {ticket.ticketCode}
                  </Typography>
                  <Typography sx={styles.patientName}>
                    Paciente: {ticket.patientName}
                  </Typography>
                </Box>
                <Typography sx={styles.timeAgo}>
                  hace {timeSince(ticket.createdAt)}
                </Typography>
              </ListItem>
            </>
          ))}
        </List>
      </Box>
    </Box>
  );
};
