import React, {useState} from "react"
import { Box, Button, Typography, useTheme, IconButton } from "@mui/material"
import { tokens } from "../../theme"
import { Pencil } from "@phosphor-icons/react"
import { NewDialog } from "../NewDialog"
import { EditBillingPosition } from "./EditBillingPosition"

export const PositionItem = ({ billingPosition }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [editMode, setEditMode] = useState(false)

  const styles = {
    itemContainer: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      padding: "20px",
      backgroundColor: colors.blueAccent[100],
      maxHeight: "100px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      margin: "10px 0",
    },
    name: {
      color: colors.blueAccent[900],
    },
    iconButton: {
      position: "absolute",
      right: "10px",
      top: "10px",
      cursor: "pointer",
    },
  };

  return (
    <Box sx={styles.itemContainer}>
      <Typography sx={styles.name} variant="h5">
        {billingPosition .name}
      </Typography>
      <IconButton onClick={() => setEditMode(true)} sx={styles.iconButton}>
        <Pencil color={colors.blueAccent[900]} />
      </IconButton>
      <NewDialog open={editMode} setOpen={setEditMode}>
        <EditBillingPosition setOpen={setEditMode} billingPosition={billingPosition} />
       </NewDialog>
    </Box>
  );
};
