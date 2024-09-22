import React, {useState} from 'react'
import { Box, FormControl, TextField, Typography, FormHelperText, Button } from '@mui/material'
import { addServiceAndQueue } from '../../hooks/services/addServiceAndQueue'

export const  NewService = ({setOpen, refresh}) => {
  const [service, setService] = useState({
    name: '',
    description:'',
    isActive: true
  })

  const [queue, setQueue] = useState({
    name: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    await addServiceAndQueue(service, queue)
    refresh()
    setOpen(false)
  }   

  return (
    <Box>
        <Typography variant="h4">
            Nuevo Servicio
        </Typography>
        <FormControl fullWidth>
            <TextField
                label="Nombre de Servicio"
                variant="outlined"
                margin="normal"
                value={service.name}
                onChange={(e) => setService({...service, name: e.target.value})}
            />
            <TextField
                label="Descripción"
                variant="outlined"
                margin="normal"
                multiline
                rows={3}
                value={service.description}
                onChange={(e) => setService({...service, description: e.target.value})}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={onSubmit}
            >
                Guardar
            </Button>
        </FormControl>
    </Box>
  )
}
