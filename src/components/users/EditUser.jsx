import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, FormControl } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useParams } from "react-router-dom";
import { useGlobalState } from "../../hooks/global/useGlobalState";
import { ServiceSelection } from "./ServiceSelection";
import {where, query, doc, getDoc, updateDoc} from "firebase/firestore";
//Global State
import { useEditState } from "../../hooks/global/useEditState";
//Firebase
import { database } from "../../firebase";
//Toast
import { toast } from "react-toastify";

export const EditUser = () => {
  const { services } = useGlobalState();
  const {setUserToEdit, userToEdit, userEditMode, setUserEditMode} = useEditState();
  const [localUser, setLocalUser] = useState(userToEdit);
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    setLocalUser(userToEdit);
  }, [userToEdit]);

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = localUser.name ? "" : "This field is required.";
    tempErrors.email = localUser.email ? "" : "This field is required.";
    tempErrors.role = localUser.role ? "" : "This field is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSave = async () => {
    if (validate()) {
      const userRef = doc(database, "users", localUser.id);
      await updateDoc(userRef, {
        name: localUser.name,
        services: localUser.services,
      });
      setUserEditMode(false);
      toast.success("Usuario actualizado correctamente.");
    } else {
      alert("Favor no dejar campos en blanco.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Editar Usuario
      </Typography>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Nombre"
          name="name"
          value={localUser.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Email"
          name="email"
          value={localUser.email}
          disabled
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Rol"
          name="role"
          value={localUser.role}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.role}
          helperText={errors.role}
        />
        <ServiceSelection
          user={localUser}
          setUser={setLocalUser}
          services={services}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          Save
        </Button>
      </FormControl>
    </Box>
  );
};