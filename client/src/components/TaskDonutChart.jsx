import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Box, Typography, Stack, useMediaQuery } from "@mui/material";

export default function TaskDonutChart({ tasks }) {
  const completed = tasks.filter(t => t.status === "DONE").length;
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const todo = tasks.filter(t => t.status === "TODO").length;

  const pieData = [
    { name: "Completed", value: completed },
    { name: "In Progress", value: inProgress },
    { name: "Todo", value: todo }
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  // 📱 detect mobile screen
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "background.paper",
        width: "100%",   // 🔥 important
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >

      <Typography variant="h6" mb={1}>
        Task Completion
      </Typography>

      {/* CHART */}
      <Box sx={{ flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height={isMobile ? 180 : 240}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 40 : 65}
              outerRadius={isMobile ? 70 : 95}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* LEGEND */}
      <Stack
        direction={isMobile ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
        spacing={isMobile ? 0.5 : 2}
        mt={1}
      >
        <Typography variant="caption" color="#22c55e">
          ● Done
        </Typography>
        <Typography variant="caption" color="#f59e0b">
          ● In Progress
        </Typography>
        <Typography variant="caption" color="#ef4444">
          ● Todo
        </Typography>
      </Stack>

      {/* FOOTER */}
      <Typography
        variant="caption"
        textAlign="center"
        color="text.secondary"
        mt={1}
      >
        {completed} / {tasks.length} completed
      </Typography>
    </Box>
  );
}
