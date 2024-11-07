import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Dashboard, Navbar, SideBar } from "./scenes";
import { ProtectedRoute } from "./scenes/ProtectedRoute";
import { Login } from "./scenes/login";
import { Services } from "./scenes/services";
import { Tickets } from "./scenes/tickets";
import { Install } from "./scenes/install";
import { Queues } from "./scenes/queues";
import { Billing } from "./scenes/billing";
import { Users } from "./scenes/users";
import { NotAllowed } from "./scenes/NotAllowed";
import { ScreenPage } from "./scenes/ScreenPage";
import App from "./App";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/install" element={<Install/>} />
        <Route path="unauthorized" element={<NotAllowed />} />

        <Route path="/" element={<App />}>
          <Route
            index
            element={
              <ProtectedRoute
                allowedRoles={["admin", "user", "billing", "doctor", "general"]}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />  
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="queues" element={<Queues />} />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="screenpage"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ScreenPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="billing"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Billing />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};
