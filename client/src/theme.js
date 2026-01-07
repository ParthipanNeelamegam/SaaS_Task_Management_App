import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#2563eb" },
    },
    shape: {
      borderRadius: 12,
    },
  });
