import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  FormHelperText,
  Button,
  Switch,
} from "@mui/material";
import { getService } from "../../hooks/getService";
import { getQueue } from "../../hooks/getQueue";
import { deleteService } from "../../hooks/deleteService";
import { editService } from "../../hooks/editService";
import { useServiceState } from "../../hooks/global/useServiceState";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { X } from "@phosphor-icons/react";
import {
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { database } from "../../firebase";

export const EditService = ({ setOpen, serviceId, queueId, refresh }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [queue, setQueue] = useState({
    name: "",
    isActive: null,
  })
  const [mainQueue, setMainQueue] = useState(null);
  const [service, setService] = useState({
    name: "",
    description: "",
    isActive: null,
  })

  const getMainQueue = async () => {
    const q = query(collection(database, "queues"), where("isMain", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setMainQueue(doc.data());
    });
  }

  useEffect(() => {
    console.log("serviceId:", serviceId);
    console.log("queueId:", queueId);
    getMainQueue()
    getService(serviceId).then((data) => {
      console.log("Service data:", data);
      setService(data);
    }).catch((error) => {
      console.error("Error fetching service:", error);
    });

    getQueue(queueId).then((data) => {
      console.log("Queue data:", data);
      setQueue(data);
    }).catch((error) => {
      console.error("Error fetching queue:", error);
    });
  }, []);

  const onDelete = (e) => {
    e.preventDefault();
    deleteService(service, queue);
    refresh();
    setOpen(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    editService(service, queue);

    setOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "row", mb: 2 }}>
        <Typography variant="h4" sx={{ mr: 1 }}>
          Editar
        </Typography>
        <Typography variant="h4">{service.name}</Typography>
      </Box>
      <FormControl fullWidth>
        <TextField
          label="Nombre de Servicio"
          variant="outlined"
          margin="normal"
          value={service.name}
          onChange={(e) => setService({ ...service, name: e.target.value })}
        />
        <TextField
          label="Descripción"
          variant="outlined"
          margin="normal"
          multiline
          rows={3}
          value={service.description}
          onChange={(e) =>
            setService({ ...service, description: e.target.value })
          }
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            py: 1,
            mb: 2,
            backgroundColor: colors.gray[500],
            border: "1px solid",
            borderColor: colors.gray[300],
          }}
        >
          {queue.isMain? (
            <Typography sx={{ fontSize: 10, maxWidth: "70%" }}>
            Este servicio es la fila principal.
            </Typography>
          ) : null }
          {mainQueue && !queue.isMain ? (
            <>
              <Typography sx={{ fontSize: 10, maxWidth: "70%" }}>
                Configurar como servicio/fila principal.
              </Typography>
              <Switch
                size="small"
                value={queue.isMain}
                checked={queue.isMain}
                onChange={(e) =>
                  setQueue({ ...queue, isMain: e.target.checked })
                }
              />
            </>
          ) : null }
        </Box>
        <Box>
          <Button
            sx={{ mr: 2 }}
            variant="contained"
            color="primary"
            onClick={onSubmit}
          >
            Guardar
          </Button>
          <Button
            sx={{ cursor: "pointer" }}
            variant="contained"
            color="error"
            onClick={onDelete}
          >
            <X />
            Eliminar
          </Button>
        </Box>
      </FormControl>
    </Box>
  );
};
