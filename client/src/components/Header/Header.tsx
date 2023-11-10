import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";

const CustomToolBar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  display: "flex",
  justifyContent: "center",
}));

const Header = () => (
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
        }}
      >
        {"MEET APP"}
      </Typography>
    </CustomToolBar>
  </AppBar>
);

export default Header;
