import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box, Chip, IconButton, Snackbar, styled } from "@mui/material";
import { ConnectionContext } from "../../providers/ConnectionProvider";
import { CopyAll } from "@mui/icons-material";

const CustomToolBar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  display: "flex",
  justifyContent: "center",
  gap: "5rem",
}));

const Header = () => {
  const [snackOpen, setSnackOpen] = useState(false);
  const { roomId } = React.useContext(ConnectionContext);

  const copyHandler = () => {
    setSnackOpen(true);
    navigator.clipboard.writeText(roomId);
  };

  return (
    <AppBar position="static">
      <CustomToolBar disableGutters>
        <Typography
          variant="h6"
          sx={{
            mr: 2,
            display: "flex",
            justifyContent: "center",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
            margin: 0,
          }}
        >
          {"MEET APP"}
        </Typography>
        {roomId && (
          <Box>
            <Chip
              icon={<CopyAll />}
              label={<Typography>Room id: {roomId}</Typography>}
              onClick={copyHandler}
              variant="outlined"
            />
            <Snackbar
              message="Copied to clibboard"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              autoHideDuration={2000}
              onClose={() => setSnackOpen(false)}
              open={snackOpen}
            />
          </Box>
        )}
      </CustomToolBar>
    </AppBar>
  );
};

export default Header;
