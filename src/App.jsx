import React, { createContext, useState, useEffect } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar } from "./scenes";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalState } from "./hooks/global/useGlobalState";
import { AuthProvider, useAuth } from "./hooks/context/AuthProvider";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH, database } from "./firebase";
import { getDocs, collection } from "firebase/firestore";
import { NotificationPopUp } from "./components/notifications/NotificationPopUp";
import { checkAdminExists } from "./utils/checkAdminExists";
export const ToggledContext = createContext(null);

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [popUpNotification, setPopUpNotification] = useState(null);
  const [popUpOpen, setPopupOpen] = useState(false);

  // Fetch Global Data
  const {
    fetchServices,
    serverIP,
    fetchIP,
    subscribeToTickets,
    subscribeToQueues,
    fetchQueues,
    setUsers,
    users,
    fetchTickets,
    fetchUsers,
    fetchVideos,
    fetchBillingPositions,
  } = useGlobalState();
  const navigate = useNavigate();
  useEffect(() => {
    fetchIP();
    console.log("Current server IP:", serverIP);
  }, [serverIP]);

  useEffect(() => {
    fetchServices();
    fetchTickets();
    fetchQueues();
    fetchUsers();
    fetchVideos();
    fetchBillingPositions();
    const unsubscribeQueues = subscribeToQueues();
    const unsubscribeTickets = subscribeToTickets((ticket) => {
      setPopUpNotification(ticket);
      setPopupOpen(true);
    });

    console.log("serverIp is", serverIP);

    return () => {
      if (unsubscribeQueues) {
        unsubscribeQueues();
      }
      if (unsubscribeTickets) {
        unsubscribeTickets();
      }
    };
  }, [fetchServices, fetchUsers, fetchQueues, subscribeToTickets]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, 'users'));
        const usersData = querySnapshot.docs.map(doc => doc.data());
        setUsers(usersData);

        const adminExists = usersData.some(user => user.role === 'admin');
        if (!adminExists) {
          navigate('/install');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <AuthProvider>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
            <SideBar />
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                maxWidth: "100%",
              }}
            >
              <Navbar />
              <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                <Outlet />
                {/* Normal notifications */}
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
                <NotificationPopUp
                  open={popUpOpen}
                  notification={popUpNotification}
                  onClose={() => setPopUpOpen(false)}
                />
                {/* Centered notifications */}
              </Box>
            </Box>
          </Box>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </AuthProvider>
  );
}

export default App;
