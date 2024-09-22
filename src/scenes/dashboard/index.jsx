import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Header } from "../../components";

import { HandWithdraw } from "@phosphor-icons/react";
import { useAuth } from "../../hooks/context/AuthProvider";

import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DoctorBillingQueue from "../../components/dashboard/doctor/DoctorBillingQueue";
import { WaitingList } from "../../components/dashboard/doctor/WaitingList";
import { ActualTicket } from "../../components/dashboard/doctor/ActualTicket";
import { DoctorDashboard } from "./DoctorDashboard";
import { BillingDashboard } from "./BillingDashboard";

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");

  const { role } = useAuth();

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Header title="Panel Principal" subtitle={`Vista del ${role}`} />
      </Box>

      {/* GRID & CHARTS */}
      <Box>
        {/* CONDITIONAL DASHBOARDS DEPENDING ROLE */}
        {role === "admin" && (
          <>
            <BillingDashboard />
          </>
        )}
        {role === "doctor" && <DoctorDashboard />}
        {role === "billing" && <BillingDashboard />}
      </Box>
    </Box>
  );
}

export default Dashboard;
