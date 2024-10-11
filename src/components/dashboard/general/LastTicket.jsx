import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { useGlobalState } from "../../../hooks/global/useGlobalState";
import { useUserState } from "../../../hooks/global/useUserState";


export const LastTicket = () => {
  const { tickets } = useGlobalState();
  const { user } = useUserState();
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const finishedTickets = tickets
    .filter((ticket) => {
      const finishedAtDate = ticket.billedAt?.toDate(); // Convert Firestore timestamp to Date
      return (
        ticket.status === "inQueue" &&
        finishedAtDate >= twentyFourHoursAgo &&
        finishedAtDate <= now
      );
    })
    .sort((a, b) => b.billedAt.toDate() - a.billedAt.toDate()); // Sort by finishedAt in descending order

  const latestTicket = finishedTickets[0]; // Get the latest ticket
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const styles = {
    finishedTickets: {
      backgroundColor: colors.primary[400],
      padding: "15px",
      borderRadius: "5px",
      minHeight: "100%",
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
    ticket: {
      padding: "10px",
      margin: "10px",
      backgroundColor: colors.gray[900],
      borderRadius: "5px",
    },
    ticketCode: {
      color: colors.primary[100],
      fontSize: "24px",
      fontFamily: "monospace",
    },
    patientName: {
      color: colors.gray[100],
      fontSize: "14px",
      fontFamily: "monospace",
    }
  };
  return (
    <Box style={styles.finishedTickets}>
      {latestTicket ? (
        <Box>
          <Box style={styles.headerContainer}>
          
          <Typography sx={styles.header}>Último Ticket</Typography>
          </Box>
          <Box style={styles.ticket}>
          <Typography sx={styles.ticketCode}>{latestTicket.ticketCode}</Typography>
          <Typography sx={styles.patientName}>{latestTicket.patientName}</Typography>
          </Box>
        </Box>
      ) : (
        <Typography>No has atendido ningun paciente hoy</Typography>
      )}
    </Box>
  );
};