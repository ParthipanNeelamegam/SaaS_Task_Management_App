import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack
} from "@mui/material";
import { useState,useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN, SIGNUP } from "../graphql/mutations";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [errorMsg, setErrorMsg] = useState("");

  const [login, { loading: loginLoading }] = useMutation(LOGIN);
  const [signup, { loading: signupLoading }] = useMutation(SIGNUP);

  useEffect(() => {
  setEmail("");
  setPassword("");
}, []);

  const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


 const handleAuth = async () => {
  setErrorMsg("");

  if (!email || !password) {
    setErrorMsg("Email and password are required");
    return;
  }

  if (!isValidEmail(email)) {
    setErrorMsg("Please enter a valid email address");
    return;
  }

  if (password.length < 6) {
    setErrorMsg("Password must be at least 6 characters");
    return;
  }

  try {
    const fn = mode === "login" ? login : signup;
    const res = await fn({ variables: { email, password } });

    localStorage.setItem("token", res.data[mode].token);
    window.location.href = "/";
  } catch (err) {
    setErrorMsg(err?.graphQLErrors?.[0]?.message || "Something went wrong");
  }
};


  return (
    <Box minHeight="100vh" display="flex">
      {/* LEFT HERO SECTION */}
      <Box
        flex={1}
        display={{ xs: "none", md: "flex" }}
        flexDirection="column"
        justifyContent="center"
        px={8}
        bgcolor="#0f172a"
        color="white"
      >
        <Typography variant="h3" fontWeight="bold" mb={2}>
          🚀 TaskFlow
        </Typography>
        <Typography variant="h6" mb={3}>
          Manage your tasks.  
          Stay focused.  
          Ship faster.
        </Typography>

        <Stack spacing={1}>
          <Typography>✅ Secure authentication</Typography>
          <Typography>✅ User-specific task management</Typography>
          <Typography>✅ Built with React, GraphQL & MongoDB</Typography>
        </Stack>
      </Box>

      {/* RIGHT AUTH CARD */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f4f6f8"
      >
        <Card sx={{ width: 380, borderRadius: 4, boxShadow: 6 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              {mode === "login" ? "Welcome back 👋" : "Create your account ✨"}
            </Typography>

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMsg}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email"
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={loginLoading || signupLoading}
              onClick={handleAuth}
            >
              {mode === "login" ? "Login" : "Signup"}
            </Button>

            <Button
              fullWidth
              sx={{ mt: 1 }}
              onClick={() =>
                setMode((prev) => (prev === "login" ? "signup" : "login"))
              }
            >
              {mode === "login"
                ? "New user? Create account"
                : "Already have an account? Login"}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
