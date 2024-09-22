import React, {useEffect} from 'react'
import { Box, Typography } from '@mui/material'
import { useGlobalState } from '../../../hooks/global/useGlobalState'
import { useUserState } from '../../../hooks/global/useUserState'
import {tokens} from '../../../theme'
import {useTheme} from '@mui/material/styles'

const DoctorBillingQueue = () => {

    const {tickets} = useGlobalState()
    const {user, fetchUser} = useUserState()
    const filteredTickets = tickets.filter(ticket => ticket.status === 'pending' && ticket.service === user?.service.id)
    
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const styles = {
        billingQueue: {
            backgroundColor: colors.primary[400],
            padding: "5px",
            borderRadius: "5px",
            minHeight: "100%",
        },
        ticket: {
            padding: "10px",
            margin: "10px",
            backgroundColor: colors.gray[900],
            borderRadius: "5px",
        },
        header:{
            color: colors.primary[100],
            marginBottom: "10px",
            padding: "10px",
            fontSize: "14px",
            fontWeight: "bold",

        },
        headerContainer:{
            borderBottom: `1px solid ${colors.primary[400]}`,
            marginBottom: "10px",
        }
    }

    useEffect(() => {
      console.log('fetching user', user)
      fetchUser()
    }, [fetchUser])


  return (
    <Box sx={styles.billingQueue}>
      <Box sx={styles.headerContainer}>
      <Typography sx={styles.header}>En facturación ({filteredTickets.length})</Typography>
      </Box>
      {filteredTickets.map(ticket => (
        <Box sx={styles.ticket} key={ticket.id}>
          <Typography variant="h6">{ticket.ticketCode}</Typography>
          <Typography variant="body1">{ticket.patientName}</Typography>
        </Box>
        ))    
    }
    </Box>
  )
}

export default DoctorBillingQueue