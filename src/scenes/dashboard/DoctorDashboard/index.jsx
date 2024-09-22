import React from 'react'
import { Box, Typography, Grid, Switch } from '@mui/material'
import { useGlobalState } from '../../../hooks/global/useGlobalState'
import { WaitingList } from '../../../components/dashboard/doctor/WaitingList'
import { ActualTicket } from '../../../components/dashboard/doctor/ActualTicket'
import DoctorBillingQueue from '../../../components/dashboard/doctor/DoctorBillingQueue'
import {useTheme} from '@mui/material'
import {tokens} from '../../../theme'
import { FinishedTickets } from '../../../components/dashboard/common/FinishedTickets'
import {CancelledTickets} from '../../../components/dashboard/common/CancelledTickets'
import { TotalTickets } from '../../../components/dashboard/common/TotalTickets'
import { LastTicket } from '../../../components/dashboard/common/LastTicket'

export const DoctorDashboard = () => {
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
        
        <Grid item xs={2}>
        <DoctorBillingQueue />
        </Grid>
        <Grid item xs={7}>
        <WaitingList />
        </Grid>
        <Grid item xs={3}>
        <ActualTicket />
        </Grid>
        <Grid item xs={3}>
        <FinishedTickets />
        </Grid>
        <Grid item xs={3}>
        <CancelledTickets />
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

