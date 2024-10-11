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
import { useGlobalState } from "../../hooks/global/useGlobalState";
import { NewVideo } from "../../components/videos/NewVideo";

export const ScreenPage = () => {
  const [newVideo, setNewVideo] = useState(false);
  const { videos } = useGlobalState();
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
          <Typography variant="h1">Videos</Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            style={{
              backgroundColor: colors.primary[400],
              color: colors.gray[100],
            }}
            onClick={() => setNewVideo(true)}
          >
           <PlusCircle/>  Nuevo Video
          </Button>
          <NewDialog open={newVideo} setOpen={setNewVideo}>
            <NewVideo setOpen={setNewVideo} />
          </NewDialog>
        </Box>
      </Box>
      <Box>
        <DataGrid
          rows={videos}
          columns={[
            { field: "title", headerName: "Titulo de Video", width: 150 },
            { field: "url", headerName: "Link del Video", width: 150 },
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
