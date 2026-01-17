import { Backdrop, CircularProgress } from "@mui/material";

export default function FullPageLoader({ open }) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 999,
        backdropFilter: "blur(4px)"
      }}
      open={open}
    >
      <CircularProgress size={60} thickness={4} />
    </Backdrop>
  );
}
