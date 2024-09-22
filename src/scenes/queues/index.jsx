import React, { useState, useEffect } from "react";
import { Box, useTheme, Grid, Typography } from "@mui/material";
import { tokens } from "../../theme";
import { useQstate } from "../../hooks/global/useQstate";
import { database } from "../../firebase";
import { onSnapshot, collection, getDocs } from "firebase/firestore";
import { QueueBox } from "../../components/queues/QueueBox";
import { BillingQueue } from "../../components/queues/BillingQueue";

export const Queues = () => {
  const { queues, setQueues } = useQstate();
  const [serviceNames, setServiceNames] = useState({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const q = collection(database, "queues");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortQueues = data.sort((a, b) => {
        if (a.isMain === b.isMain) {
          return 0;
        }
        return a.isMain ? -1 : 1;
      });
      setQueues(sortQueues);
    });
    return () => unsubscribe();
  }, [database]);

  const styles = {
    page: {
      padding: "40px",
      backgroundColor: colors.background,
    },
    header: {
      mb: 3,
    },
  };

  return (
    <Grid sx={styles.page}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box sx={styles.header}>
          <Typography variant="h1">Filas / Colas</Typography>
        </Box>
      </Box>
      <Box>
        <Grid container spacing={2}>
          <BillingQueue />
          {queues.map((queue) => {
            if (queue.isMain) {
              return null;
            }
            return (
              <Grid item xs={12} sm={6} md={4} lg={4} key={queue.id}>
                <QueueBox queue={queue} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Grid>
  );
};
