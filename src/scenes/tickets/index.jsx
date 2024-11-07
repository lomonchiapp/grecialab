import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Grid,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { NewDialog } from "../../components/NewDialog";
import { useGlobalState } from "../../hooks/global/useGlobalState";
import { NewTicket } from "../../components/tickets/NewTicket";
import { database } from "../../firebase";
import { onSnapshot, collection, getDocs } from "firebase/firestore";
import { Delete } from "@mui/icons-material";
import { deleteTicket } from "../../hooks/tickets/deleteTicket";

export const Tickets = () => {
  const [newTicket, setNewTicket] = useState(false);
  const { tickets, setTickets, subscribeToTickets } = useGlobalState();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const styles = {
    page: {
      padding: "40px",
      backgroundColor: colors.background,
    },
    ServicesContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "20px",
    },
    header: {
      mb: 3,
    },
  };
  const statusLabels = {
    pending: "Esperando a facturar",
    billing: "Facturando",
    billed: "Facturado",
    processing: "Siendo atendido",
    inQueue: "En Fila",
    bCancelled: "Cancelado en Facturación",
    cancelled: "Cancelado",
    finished: "Finalizado",
  };
  useEffect(() => {
    const unsuscribe = subscribeToTickets();
    return () => unsuscribe();
  }, [subscribeToTickets]);

  return (
    <Grid sx={styles.page}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box sx={styles.header}>
          <Typography variant="h1">Tickets / Turnos</Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            style={{
              backgroundColor: colors.primary[400],
              color: colors.gray[100],
            }}
            onClick={() => setNewTicket(true)}
          >
            Nuevo Ticket
          </Button>
          <NewDialog open={newTicket} setOpen={setNewTicket}>
            <NewTicket setOpen={setNewTicket} />
          </NewDialog>
        </Box>
      </Box>
      <Box>
        <DataGrid
          rows={tickets}
          columns={[
            { field: "patientName", headerName: "Nombre", width: 150 },
            {
              field: "services",
              headerName: "Servicios",
              width: 150,
              valueGetter: (params) => {
                const services = params.row.services;
                return services?.map((service) => service.name).join(", ");
              },
            },
            { field: "ticketCode", headerName: "Fila / Turno", width: 150 },
            {
              field: "date",
              headerName: "Fecha",
              width: 150,
              valueGetter: (params) => {
                const createdAt = params.row.createdAt;
                const date = createdAt?.toDate
                  ? createdAt.toDate()
                  : new Date(createdAt);
                return `${date.getDate()}/${
                  date.getMonth() + 1
                }/${date.getFullYear()}`;
              },
            },
            {
              field: "time",
              headerName: "Hora",
              width: 150,
              valueGetter: (params) => {
                const createdAt = params.row.createdAt;
                const time = createdAt?.toDate
                  ? createdAt.toDate()
                  : new Date(createdAt);
                const hours = time.getHours();
                const minutes = time.getMinutes();
                const seconds = time.getSeconds();
                const ampm = hours >= 12 ? "PM" : "AM";
                const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
                const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

                return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
              },
            },
            {
              field: "status",
              headerName: "Estado",
              width: 150,
              renderCell: (params) => {
                return (
                  <Typography
                    style={{
                      color: colors.primary[100],
                      fontWeight: "bold",
                    }}
                  >
                    {statusLabels[params.value]}
                  </Typography>
                );
              },
            },
            {
              field: "actions",
              headerName: "Acciones",
              width: 150,
              renderCell: (params) => {
                return (
                  <>
                    <Delete onClick={() => deleteTicket(params.id)} />
                  </>
                );
              },
            },
          ]}
          pageSize={5}
          editMode
          rowsPerPageOptions={[5, 10, 20]}
          GridToolbarComponents={[GridToolbar]}
          sx={{
            height: 400,
            width: "100%",
            backgroundColor: colors.primary[400],
            color: colors.gray[100],
          }}
        />
      </Box>
    </Grid>
  );
};
