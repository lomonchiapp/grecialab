import React, { useState } from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  FormHelperText,
  Button,
} from "@mui/material";
import { createUser } from "../../hooks/users/createUser";
import { Select, MenuItem } from "@mui/material";
import { Close } from "@mui/icons-material";
import { roles } from "../../utils/roles/roles";
import { useGlobalState } from "../../hooks/global/useGlobalState";

export const NewUser = ({ setOpen, refresh }) => {
  const { services } = useGlobalState();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    service: {},
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await createUser(user);
    setOpen(false);
  };


  return (
    <Box>
      <Typography variant="h4">Nuevo Usuario</Typography>
      <Close
        sx={{ position: "absolute", right: 10, top: 10, cursor: "pointer" }}
        onClick={() => setOpen(false)}
      />
      <FormControl fullWidth>
        <TextField
          label="Nombre Completo"
          size="small"
          variant="outlined"
          margin="normal"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <TextField
          label="Email"
          size="small"
          variant="outlined"
          margin="normal"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <TextField
          label="Password"
          size="small"
          type="password"
          variant="outlined"
          margin="normal"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <Select
          label="Rol"
          size="small"
          variant="outlined"
          margin="normal"
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
        >
          {roles.map((role) => (
            <MenuItem key={role.id} value={role.value}>
              {role.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Selecciona el rol del usuario a crear.</FormHelperText>
        {user.role == "doctor" && (
          <FormControl fullWidth>
          <Select
            sx={{my:2}}
            label="Servicio"
            size="small"
            variant="outlined"
            margin="normal"
            value={user.service}
            onChange={(e) => setUser({ ...user, service: e.target.value })}
          >
            {services.map((service) => (
              <MenuItem key={service.id} value={service}>
                {service.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Selecciona el servicio al que pertenece el doctor.</FormHelperText>

          </FormControl>
        )}

        
        <Button variant="contained" color="primary" onClick={onSubmit}>
          Guardar
        </Button>
      </FormControl>
    </Box>
  );
};
