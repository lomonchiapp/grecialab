import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../hooks/global/useGlobalState";
import {Box, Grid, Typography} from "@mui/material";
import {getNotifications} from "../../hooks/notifications/getNotifications";
import {tokens} from "../../theme";
import {useTheme} from "@mui/material";
import { X, XCircle } from "@phosphor-icons/react";

export const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    useEffect(() => {
      const unsubscribe = getNotifications(setNotifications);
      return () => unsubscribe();
    }, []);

    const handleDeleteNotification = (id) => {
        const newNotifications = notifications.filter((notification) => notification.id !== id);
        setNotifications(newNotifications);
    };
    const styles = {
        title: {
            backgroundColor: colors.gray[700],
            fontSize: 12,
            p:1,
            borderRadius: "5px",
            fontWeight: "bold",
            color: colors.gray[100],
        },
        message: {
            fontSize: 10,
            p:1,
            color: colors.gray[100],
        },
        x: {
            position: 'absolute',
            right: 5,
            top: 5,
            backgroundColor: 'rgba(106, 3, 3, 0.952)',
            borderRadius: '50%',
            p:'5px',
        },

        };
    return (
        <Grid container spacing={2}>
            {notifications.map((notification) => (
                <Grid item xs={12} key={notification.id}>
                    <Box
                        sx={{
                            backgroundColor: colors.gray[800],
                            position:'relative',
                            padding: "10px",
                            borderRadius: "5px",
                            borderBottom: `1px solid ${colors.gray[600]}`,
                            mx:2,
                        }}
                    >
                        <X style={styles.x} size={15} color={colors.gray[100]} />
                        <Typography sx={styles.title}>{notification.title}</Typography>
                        <Typography sx={styles.message}>{notification.message}</Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
    }