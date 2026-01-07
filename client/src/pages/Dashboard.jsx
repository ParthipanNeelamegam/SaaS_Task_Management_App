// 🎨 Enhanced, colorful, space-filled Dashboard UI
// ✅ NO logic changed – only UI, layout, colors, and content

import {
  Box, Card, CardContent, Typography, TextField, Button,
  List, ListItem, Chip, MenuItem, Select, IconButton,
  Grid, Divider, Avatar, LinearProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS, ADD_TASK, UPDATE_TASK, DELETE_TASK } from "../graphql/queries";
import WeeklyChart from "../components/WeeklyChart";
import { useState } from "react";

export default function Dashboard({ toggleTheme }) {
  const { data } = useQuery(GET_TASKS);
  const [addTask] = useMutation(ADD_TASK, { refetchQueries: [GET_TASKS] });
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK, { refetchQueries: [GET_TASKS] });

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const tasks = data?.tasks || [];

  const completed = tasks.filter(t => t.status === "DONE").length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? (completed / tasks.length) * 100 : 0;

  return (
    <Box p={4} bgcolor="#f4f7fb" minHeight="100vh">

      {/* 🌈 HEADER */}
      <Card sx={{ mb: 4, borderRadius: 4, background: "linear-gradient(135deg,#667eea,#764ba2)", color: "white" }}>
        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>TaskFlow Dashboard</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Plan • Track • Complete your tasks efficiently
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={toggleTheme} sx={{ color: "white" }}><DarkModeIcon /></IconButton>
            <Button color="error" variant="contained" sx={{ ml: 2 }} onClick={() => {
              localStorage.clear();
              window.location.href = "/auth";
            }}>Logout</Button>
          </Box>
        </CardContent>
      </Card>

      {/* 📊 STATS ROW */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, bgcolor: "#e0f2fe" }}>
            <CardContent>
              <Avatar sx={{ bgcolor: "#0284c7", mb: 1 }}><ListAltIcon /></Avatar>
              <Typography variant="h4">{tasks.length}</Typography>
              <Typography color="text.secondary">Total Tasks</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, bgcolor: "#dcfce7" }}>
            <CardContent>
              <Avatar sx={{ bgcolor: "#16a34a", mb: 1 }}><AssignmentTurnedInIcon /></Avatar>
              <Typography variant="h4">{completed}</Typography>
              <Typography color="text.secondary">Completed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, bgcolor: "#fff7ed" }}>
            <CardContent>
              <Avatar sx={{ bgcolor: "#f97316", mb: 1 }}><PendingActionsIcon /></Avatar>
              <Typography variant="h4">{pending}</Typography>
              <Typography color="text.secondary">Pending</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>

        {/* 📝 TASK PANEL */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" mb={2}>Add New Task</Typography>

              <Box display="flex" gap={1} mb={3}>
                <TextField label="Task title" fullWidth value={title} onChange={e => setTitle(e.target.value)} />
                <TextField type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                <Button variant="contained" onClick={() => {
                  addTask({ variables: { title, dueDate } });
                  setTitle(""); setDueDate("");
                }}>Add</Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <List>
                {tasks.map(task => {
                  const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";

                  return (
                    <ListItem key={task.id} sx={{ mb: 1.5, borderRadius: 3, bgcolor: overdue ? "#fee2e2" : "#f8fafc", boxShadow: 1 }}>
                      <Typography flex={1} fontWeight={500}>{task.title}</Typography>

                      {task.dueDate && (
                        <Chip label={new Date(task.dueDate).toLocaleDateString()} color={overdue ? "error" : "primary"} size="small" />
                      )}

                      <Select size="small" value={task.status} onChange={e => updateTask({ variables: { id: task.id, status: e.target.value } })}>
                        <MenuItem value="TODO">TODO</MenuItem>
                        <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
                        <MenuItem value="DONE">DONE</MenuItem>
                      </Select>

                      <IconButton color="error" onClick={() => deleteTask({ variables: { id: task.id } })}><DeleteIcon /></IconButton>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* 📈 ANALYTICS PANEL */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={1}>Weekly Progress</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>Visual overview of your productivity</Typography>
              <WeeklyChart tasks={tasks} />
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" mb={1}>Overall Completion</Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">{Math.round(progress)}% completed</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}