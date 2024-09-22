// React imports
import React, { useState, useEffect } from "react"
// MUI imports
import {
  Box,
  useTheme,
  Grid,
  Typography,
  Button,
} from "@mui/material";
// MUI X Data Grid imports
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// Theme Imports
import { tokens } from "../../theme";
import { NewDialog } from "../../components/NewDialog";
import { NewUser } from "../../components/users/NewUser";
import { database } from "../../firebase";
import { onSnapshot, collection, getDocs } from "firebase/firestore";
import { PlusCircle } from "@phosphor-icons/react";
import { roles } from "../../utils/roles/roles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const Users = () => {
  const [newUser, setNewUser] = useState(false);
  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const q = collection(database, "users");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
      console.log("Users data:", data);
    });
    return unsubscribe;
  }, [database]);


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


  const getRoleLabel = (value) => {
    const role = roles.find(role => role.value === value);
    return role ? role.label : value;
  };
  
  const mappedUsers = users.map(user => ({
    ...user,
    role: getRoleLabel(user.role)
  }));
  
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
          <Typography variant="h1">Usuarios / Accesos</Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            style={{
              backgroundColor: colors.primary[400],
              color: colors.gray[100],
            }}
            onClick={() => setNewUser(true)}
          >
           <PlusCircle/>  Nuevo Usuario
          </Button>
          <NewDialog open={newUser} setOpen={setNewUser}>
            <NewUser setOpen={setNewUser} />
          </NewDialog>
        </Box>
      </Box>
      <Box>
        <DataGrid
          rows={mappedUsers}
          columns={[
            { field: "name", headerName: "Nombre", width: 150 },
            { field: "email", headerName: "Correo Electronico", width: 150 },
            { field: "role", headerName: "Departamento", width: 150 },
            {
              field: "actions",
              headerName: "Acciones",
              width: 150,
              renderCell: (params) => (
                <div>
                  <EditIcon
                    style={{ cursor: 'pointer', marginRight: 8 }}
                    onClick={() => handleEdit(params.row)}
                  />
                  <DeleteIcon
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDelete(params.row)}
                  />
                </div>
              ),
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
