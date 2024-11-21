import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { useGlobalState } from "../../../../hooks/global/useGlobalState";
import { useUserState } from "../../../../hooks/global/useUserState";
import { tokens } from "../../../../theme";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import {
  updateToBilled,
  updateToBCancelled,
  updateToBilling,
} from "../../../../hooks/tickets/updateTicket";
import { Check, CheckCircle, XCircle } from "@phosphor-icons/react";
import { useBillingState } from "../../../../hooks/global/useBillingState";

export const BillingPosition = ({ canBill, setCanBill }) => {
  const { tickets, subscribeToTickets, services } = useGlobalState();
  const { user } = useUserState();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [enabledButton, setEnabledButton] = useState(false);
  const billingTicket = tickets.find(
    (ticket) =>
      ticket.status === "billing" &&
      ticket.billingPosition?.id === user?.billingPosition?.id
  );

  const handleBilling = async (ticketId) => {
    await updateToBilled(ticketId, user);
  };

  const handleBCancel = async (ticketId) => {
    await updateToBCancelled(ticketId, user);
  };

  const handleTakeTurn = async () => {
    const nextTicket = tickets
      .filter((ticket) => ticket.status === "pending")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];
    await updateToBilling(nextTicket.id, user);
  };

  useEffect(() => {
    const unsubscribe = subscribeToTickets();
    return () => unsubscribe();
  }, [subscribeToTickets]);

  useEffect(() => {
    if (billingTicket) {
      setCanBill(true);
    } else {
      setCanBill(false)
    }
  }, [billingTicket]);

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
      flexDirection: "row",
      display: "flex",
      justifyContent: "space-between",
      margin: "10px",
      backgroundColor: colors.gray[800],
      borderRadius: "5px",
    },
    ticketContainer: {
      padding: "10px",
      display: "flex",
      justifyContent: "center",
      flexDirection: "row",
      backgroundColor: colors.gray[500],
      borderRadius: "5px",
    },
    ticketCode: {
      color: colors.primary[100],
      fontFamily: "monospace",
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "bold",
    },
    ticketHeader: {
      color: colors.primary[100],
      fontFamily: "monospace",
      mb: 1,
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
      marginBottom: "10px",
    },
    btnContainer: {
      display: "flex",
      justifyContent: "space-around",
      paddingTop: "10px",
      mt: 3,
      borderRadius: "25px",
      border: `1px solid ${colors.gray[700]}`,
    },
    patientContainer: {
      padding: "10px",
      mt: "10px",
      border: `1px solid ${colors.primary[400]}`,
      borderRadius: "5px",
      backgroundColor: colors.gray[800],
    },
    patientName: {
      color: colors.primary[100],
      fontSize: "14px",
      fontWeight: "bold",
      fontFamily: "monospace",
      pl: 2,
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
      fontSize: "14px",
      fontWeight: "bold",
    },
    helperText: {
      color: colors.primary[100],
      fontSize: "10px",
    },
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.headerContainer}>
        <Typography sx={styles.header}>
          Puesto de Facturación ({user?.billingPosition?.name})
        </Typography>
      </Box>
      {billingTicket ? (
        <Box sx={styles.patientContainer}>
          <Box sx={styles.ticketContainer}>
            <Typography sx={styles.ticketCode}>
              {billingTicket.ticketCode}
            </Typography>
          </Box>
          <Typography sx={styles.patientLabel}>Paciente:</Typography>
          <Typography sx={styles.patientName}>
            {billingTicket.patientName}
          </Typography>
          <Typography sx={styles.patientLabel}>Servicio:</Typography>
          <Typography sx={styles.patientName}>
            {billingTicket.services?.map((service) => service.name).join(", ")}
          </Typography>

          <Box sx={styles.btnContainer}>
            <IconButton onClick={() => handleBCancel(billingTicket.id)}>
              <XCircle size={70} />
            </IconButton>
            <IconButton onClick={() => handleBilling(billingTicket.id)}>
              <CheckCircle size={70} />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box sx={styles.idleBox}>
          <Typography sx={styles.idleText}>Puesto Libre</Typography>
          <Button
            disabled={enabledButton}
            variant="contained"
            size="large"
            onClick={() => handleTakeTurn()}
          >
            ATENDER PACIENTE
          </Button>
          {enabledButton && (
            <Typography sx={styles.helperText}>
              Espera a que algún paciente facture
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
