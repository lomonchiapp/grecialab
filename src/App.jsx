import React, { createContext, useState, useEffect } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar } from "./scenes";
import { Outlet } from "react-router-dom";
import { AppRouter } from "./Router";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalState } from "./hooks/global/useGlobalState";
import {useAuth} from "./hooks/context/AuthProvider";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebase";
import {NotificationPopUp} from "./components/notifications/NotificationPopUp"

export const ToggledContext = createContext(null);

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };
  const {isAuthenticated,  setIsAuthenticated} = useAuth();
  const [popUpNotification, setPopUpNotification] = useState(null);
  const [popUpOpen, setPopupOpen] = useState(false);

  // Fetch Global Data
  const {fetchServices, subscribeToTickets, fetchQueues, fetchTickets, fetchUsers, fetchVideos, fetchBillingPositions} = useGlobalState();

  useEffect(() => {
    fetchServices();
    fetchTickets();
    fetchUsers();
    fetchVideos()
    fetchBillingPositions()
    const unsubscribeQueues = fetchQueues();
    const unsubscribeTickets = subscribeToTickets((ticket) => {
      setPopUpNotification(ticket);
      setPopupOpen(true);
    });
  
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
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, [])

  return (
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
  );
}

export default App;
