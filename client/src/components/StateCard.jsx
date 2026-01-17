import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const StatCard = ({ title, value, color }) => (
  <Paper
   sx={{
    p: 2,
    borderRadius: 3,
    background: color || "#f8fafc",
    height: { xs: 100, sm: 110 },               
    display: "flex",         
    flexDirection: "column",
    justifyContent: "center",
    gap: 0.5
  }}
  >
    <Typography variant="caption" color="text.secondary">
      {title}
    </Typography>
    <Typography variant="h5" fontWeight="bold">
      {value}
    </Typography>
  </Paper>
);
export default StatCard;