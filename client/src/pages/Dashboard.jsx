import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Chip,
  MenuItem,
  Select,
  CircularProgress,
  Grid,
  Divider
} from "@mui/material";

import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS, ADD_TASK, UPDATE_TASK, DELETE_TASK } from "../graphql/queries";
import { useState } from "react";

import WeeklyChart from "../components/WeeklyChart";
import TaskDonutChart from "../components/TaskDonutChart";
import StatCard from "../components/StateCard";

const statusColors = {
  TODO: "default",
  IN_PROGRESS: "warning",
  DONE: "success"
};

export default function Dashboard() {
  const { data, loading, error } = useQuery(GET_TASKS);
  const [addTask] = useMutation(ADD_TASK, { refetchQueries: [GET_TASKS] });
  const [updateTask] = useMutation(UPDATE_TASK, { refetchQueries: [GET_TASKS] });
  const [deleteTask] = useMutation(DELETE_TASK, { refetchQueries: [GET_TASKS] });

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({ title: "", date: "" });

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error.message}
      </Typography>
    );
  }

  const tasks = data?.tasks || [];
  const completed = tasks.filter(t => t.status === "DONE").length;
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;

  const today = new Date().toDateString();
  const todayTasks = tasks.filter(
    t => t.dueDate && new Date(t.dueDate).toDateString() === today
  );
  const overdue = tasks.filter(
    t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
  );

  return (
    <Box minHeight="100vh" bgcolor="#f4f6f8">
      {/* TOP BAR */}
     <Box
 sx={{
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(12px)",
    background: "rgba(255,255,255,0.85)",
    borderBottom: "1px solid #e5e7eb",
    px: 4,
    py: 2,
    mb: 4,
  }}
>
  {/* Decorative glow */}
  <Box
>
  <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
  >
    {/* LEFT */}
    <Box>
      <Typography fontWeight="bold" fontSize={30}>
        🚀 TaskFlow Admin
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Smart task management dashboard
      </Typography>
    </Box>

    {/* RIGHT */}
    <Button
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}
      sx={{
        borderRadius: "999px",
        px: 3,
        fontWeight: "bold",
        background: "#ef4444",
        color: "#fff",
        "&:hover": {
          background: "#dc2626",
        },
      }}
    >
      Logout
    </Button>
  </Box>
</Box>


      </Box>

      <Box px={4} py={0}>
        {/* INSIGHT CARDS */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Tasks" value={tasks.length} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed"
              value={completed}
              color="#dcfce7"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="In Progress"
              value={inProgress}
              color="#ffedd5"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Overdue"
              value={overdue}
              color="#fee2e2"
            />
          </Grid>
        </Grid>


        {/* CHARTS */}
      <Grid container spacing={3} mb={3} justifyContent={'space-between'}>
      <Grid item xs={12} md={8} width={'48%'}>
        <WeeklyChart tasks={tasks} />
      </Grid>


      <Grid item xs={12} md={4} width={'48%'}>
        
        <TaskDonutChart tasks={tasks} completed={completed}/>
      </Grid>
    </Grid>


        {/* TASK LIST */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              📝 Task Management
            </Typography>

            <Box display="flex" gap={1} mb={3}>
               <TextField
                fullWidth
                size="small"
                label="Task title"
                value={title}
                error={!!errors.title}
                helperText={errors.title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, title: "" }));
                }}
              />
             <TextField
              type="date"
              size="small"
              value={dueDate}
              error={!!errors.date}
              helperText={errors.date || " "}
              onChange={(e) => {
                setDueDate(e.target.value);
                setErrors((prev) => ({ ...prev, date: "" }));
              }}
            />

                <Button
                  variant="contained"
                  disabled={!title.trim() || !dueDate}
                  onClick={async () => {
                    let hasError = false;
                    const newErrors = { title: "", date: "" };

                    if (!title.trim()) {
                      newErrors.title = "Task title is required";
                      hasError = true;
                    }

                    if (!dueDate) {
                      newErrors.date = "Date is required";
                      hasError = true;
                    }

                    if (hasError) {
                      setErrors(newErrors);
                      return;
                    }

                    await addTask({
                      variables: {
                        title: title.trim(),
                        dueDate
                      }
                    });

                    setTitle("");
                    setDueDate("");
                    setErrors({ title: "", date: "" });
                  }}
                >
                  Add
                </Button>
            </Box>

            <Divider />
   <Box
  sx={{
    maxHeight: 420,        // 👈 fixed height
    overflowY: "auto",
    pr: 1,
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c7d2fe",
      borderRadius: "8px",
    },
  }}
>
            {tasks.length === 0 ? (
              <Box textAlign="center" py={6}>
                <Typography variant="h6">No tasks yet 🚀</Typography>
                <Typography color="text.secondary">
                  Add your first task to see analytics
                </Typography>
              </Box>
            ) : (
              <List>
                {tasks.map(task => {
                  const isOverdue =
                    task.dueDate &&
                    new Date(task.dueDate) < new Date() &&
                    task.status !== "DONE";

                  return (
                    <ListItem
                      key={task.id}
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        bgcolor: isOverdue ? "#fee2e2" : "#fafafa",
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <Box>
                        <Typography fontWeight="bold">{task.title}</Typography>
                        {task.dueDate && (
                          <Typography variant="caption">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>

                      <Box display="flex" gap={1} alignItems="center">
                        <Chip
                          label={task.status}
                          color={statusColors[task.status]}
                          size="small"
                        />
                        <Select
                          size="small"
                          value={task.status}
                          onChange={(e) =>
                            updateTask({
                              variables: { id: task.id, status: e.target.value }
                            })
                          }
                        >
                          <MenuItem value="TODO">TODO</MenuItem>
                          <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
                          <MenuItem value="DONE">DONE</MenuItem>
                        </Select>
                        <Button
                          color="error"
                          onClick={() =>
                            deleteTask({ variables: { id: task.id } })
                          }
                        >
                          Delete
                        </Button>
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
