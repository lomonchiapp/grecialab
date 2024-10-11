import React, {useState} from 'react'
import { Box, FormControl, TextField, Typography, FormHelperText, Button } from '@mui/material'
import { newBillingPosition } from '../../hooks/billing/newBillingPosition'
import { useGlobalState } from '../../hooks/global/useGlobalState'

export const  NewBillingPosition = ({setOpen}) => {
  const {fetchBillingPositions} = useGlobalState()
  const [billingPosition, setBillingPosition] = useState({
    name: '',
    isActive: true
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    await newBillingPosition(billingPosition)
    fetchBillingPositions()
    setOpen(false)
  }   

  return (
    <Box>
        <Typography variant="h4">
            Nueva Posición de Facturación
        </Typography>
        <FormControl fullWidth>
            <TextField
                label="Nombre de la Posición"
                variant="outlined"
                margin="normal"
                value={billingPosition.name}
                onChange={(e) => setBillingPosition({...billingPosition, name: e.target.value})}
            />
            <FormHelperText>
              Ejemplo: Facturación 1, Facturación de Emergencias, etc.
            </FormHelperText>

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
