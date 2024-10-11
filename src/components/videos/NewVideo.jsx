import React, { useState } from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  FormHelperText,
  Button,
} from "@mui/material";
import { newVideo } from "../../hooks/videos/newVideo";
import { Close } from "@mui/icons-material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import { useGlobalState } from "../../hooks/global/useGlobalState";

export const NewVideo = ({ setOpen }) => {
    const theme = useTheme();
    const {fetchVideos} = useGlobalState();
    const colors = tokens(theme.palette.mode);
    const [video, setVideo] = useState({
        title: "",
        url: "",
    });
    
    const onSubmit = async (e) => {
        e.preventDefault();
        await newVideo(video);
        setOpen(false);
        fetchVideos();
    };

    return (
        <Box>
            <Typography variant="h4">Nuevo Video</Typography>
            <Close
                sx={{ position: "absolute", right: 10, top: 10, cursor: "pointer" }}
                onClick={() => setOpen(false)}
            />
            <FormControl fullWidth>
                <TextField
                    label="Título"
                    size="small"
                    variant="outlined"
                    margin="normal"
                    value={video.title}
                    onChange={(e) => setVideo({ ...video, title: e.target.value })}
                />
                <TextField
                    label="URL"
                    size="small"
                    variant="outlined"
                    margin="normal"
                    value={video.url}
                    onChange={(e) => setVideo({ ...video, url: e.target.value })}
                />
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    style={{ backgroundColor: colors.primary[400], color: colors.gray[100] }}
                >
                    Guardar
                </Button>
            </FormControl>
        </Box>
    );
}