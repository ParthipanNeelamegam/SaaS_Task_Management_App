import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Box, Typography, Stack } from "@mui/material";

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

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "background.paper",
        height: "%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <Typography variant="h6">Task Completion</Typography>

      <Box sx={{ flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
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

      <Stack
        direction="row"
        justifyContent="center"
        spacing={2}
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
