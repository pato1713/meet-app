import React from "react";
import { Button, Input, Paper, styled } from "@mui/material";

export const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

export const StyledInput = styled(Input)(({ theme }) => ({}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  display: "flex",
  flexDirection: "column",
  alignContent: "center",
  justifyContent: "center",
  padding: "10px",
  flex: "1px 1px 0",
  width: "100%",
}));
