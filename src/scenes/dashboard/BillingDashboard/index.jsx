import React, {useState} from 'react'
import { Box, Typography, Grid, Switch } from '@mui/material'
import { useGlobalState } from '../../../hooks/global/useGlobalState'
import { BillingPosition } from '../../../components/dashboard/billing/BillingPosition'
import {useTheme} from '@mui/material'
import {tokens} from '../../../theme'
import { FinishedTickets } from '../../../components/dashboard/common/FinishedTickets'
import {BCancelledTickets} from '../../../components/dashboard/billing/BCancelledTickets'
import { TotalTickets } from '../../../components/dashboard/billing/TotalTickets'
import { LastTicket } from '../../../components/dashboard/billing/LastTicket'
import { PendingList } from '../../../components/dashboard/billing/PendingList'
import { BilledTickets } from '../../../components/dashboard/billing/BilledTickets'

export const BillingDashboard = () => {
    const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const [canBill, setCanBill] = useState(false);
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
        <PendingList canBill={canBill} />
        </Grid>
        <Grid item xs={4}>
        <BillingPosition canBill={canBill} setCanBill={setCanBill} />
        </Grid>
        <Grid item xs={3}>
        <BilledTickets />
        </Grid>
        <Grid item xs={3}>
        <BCancelledTickets />
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

