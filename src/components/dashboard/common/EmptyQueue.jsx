import React from 'react'
import {Box, Typography} from '@mui/material'

export const EmptyQueue = () => {
  const styles = {
    idleIcon: {
      width: '100px',
      height: '100px',
      fill: '#FFF',
    },
  }
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 150,
    }}>
      <Box>
        <img src="src/assets/images/chair.png" alt="Idle" style={styles.idleIcon} />
      </Box>
      <Typography variant="h5">No hay pacientes en espera</Typography>
    </Box>
  )
}
