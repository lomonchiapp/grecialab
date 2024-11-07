import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { database } from '../../firebase'
import { toast } from 'react-toastify'
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { createAdmin } from '../../hooks/users/createUser';
import { useNavigation, useNavigate } from 'react-router-dom';

export const InstallForm = () => {
    const [user, setUser] = useState({
      name: '',
      email: '',
      password: '',
      role: 'admin',
    });
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
      const checkAdminExists = async () => {
        const querySnapshot = await getDocs(collection(database, 'users'));
        const adminExists = querySnapshot.docs.some(doc => doc.data().role === 'admin');
        if (adminExists) {
          setIsFormDisabled(true);
        }
      };
  
      checkAdminExists();
    }, []);
  
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
        };

  
    const handleSubmit = async (e) => {
        e.preventDefault();
      await createAdmin(user)
      navigate('/login')
      
    }; 
  
    return (
        <Container>
        <Box sx={{ mt: 4 }}>
          <Typography textAlign={"center"} variant="h4" component="h1" gutterBottom>
            Formulario de Instalación
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre Completo"
              name="name"
              value={user.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              disabled={isFormDisabled}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              disabled={isFormDisabled}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              disabled={isFormDisabled}
            />
            <Box>
              <Typography textAlign={"center"} variant="body1" color="textSecondary">

      El primer usuario que se registre en el sistema será el administrador principal.
              </Typography>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isFormDisabled}
              sx={{ mt: 2 }}
            >
             Crear Administrador
            </Button>
          </form>
          {isFormDisabled && (
            <Typography variant="body1" color="error" sx={{ mt: 2 }}>
              Ya existe un administrador en el sistema. Por razones de seguridad este formulario ya es inutilizable..
            </Typography>
          )}
        </Box>
      </Container>
    );
  };
  