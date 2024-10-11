import React from 'react'
import { Box, Typography, Grid, Switch } from '@mui/material'
import { useGlobalState } from '../../../hooks/global/useGlobalState'
import { ActualTicket } from '../../../components/dashboard/general/ActualTicket'
import {useTheme} from '@mui/material'
import {tokens} from '../../../theme'
import { TotalTickets } from '../../../components/dashboard/general/TotalTickets'
import { LastTicket } from '../../../components/dashboard/general/LastTicket'
import { PendingList } from '../../../components/dashboard/general/PendingList'
import { BilledTickets } from '../../../components/dashboard/general/BilledTickets'

export const GeneralDashboard = () => {
    const theme = useTheme();
   const colors = tokens(theme.palette.mode);
    const styles = {

        switchBox: {
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'absolute',
        },
        dashboard:{
            position:'relative',
        }
    }
  return (
    <Grid sx={styles.dashboard} container spacing={2}>
        
        <Grid item xs={8}>
        <PendingList />
        </Grid>
        <Grid item xs={4}>
        <ActualTicket />
        </Grid>
        <Grid item xs={3}>
        <BilledTickets />
        </Grid>
        <Grid item xs={3}>
        <TotalTickets />
        </Grid>
        <Grid item xs={3}>
        <LastTicket />
        </Grid>


    </Grid>
  )
}

