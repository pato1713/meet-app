import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";
import { ConnectionContext } from "../../providers/ConnectionProvider";

const CustomToolBar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  display: "flex",
  justifyContent: "center",
  gap: "5rem",
}));

const Header = () => {
  const { roomId } = React.useContext(ConnectionContext);
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
        {roomId && <Typography>Room id: {roomId}</Typography>}
      </CustomToolBar>
    </AppBar>
  );
};

export default Header;
