
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Grid,
  InputAdornment,
} from "@mui/material";
import axios from "axios";

// Notion-like theme colors
const COLORS = {
  BACKGROUND: "#fff",
  TEXT: "#191919",
  ACCENT: "#37352f",
  BORDER: "#ebebeb",
  HOVER: "#f5f5f5",
  BUTTON: "#37352f",
  BUTTON_TEXT: "#fff",
};

export default function LoginView({ onLoginSuccess }) {
  // Login form state
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  // Registration dialog state
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
  });
  
  // Notification states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle login field change
  const handleLoginChange = (e) => {
    setLoginForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Handle register field change
  const handleRegisterChange = (e) => {
    setRegisterForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };
const API_BASE = process.env.REACT_APP_API_URL || "https://lost-and-found-java-mern-1.onrender.com/api";

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      setError("Please enter username and password.");
      return;
    }
    try {console.log("Login payload:", loginForm);
      // Change endpoint as needed
      const res = await axios.post(`${API_BASE}/login`, loginForm);
      if (res.data.success) {
        setSuccess("Login successful!");
        setTimeout(() => {
          setSuccess("");
          onLoginSuccess(res.data.user); // must be handled in parent
        }, 800);
      } else {
        setError(res.data.message || "Invalid username or password.");
      }
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerForm.username || !registerForm.password) {
      setError("Username and password are required.");
      return;
    }
    try {
      // Change endpoint as needed
      const res = await axios.post(`${API_BASE}/register`, registerForm);
      if (res.data.success) {
        setSuccess("Registration successful! Please log in.");
        setRegisterOpen(false);
        setRegisterForm({
          username: "",
          password: "",
          email: "",
          phone: "",
        });
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  // Reset error/success when opening/closing dialogs
  React.useEffect(() => {
    if (!registerOpen) setError("");
  }, [registerOpen]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.BACKGROUND,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 400,
          borderRadius: 4,
          p: 4,
          bgcolor: COLORS.BACKGROUND,
          border: `1px solid ${COLORS.BORDER}`,
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          align="center"
          fontWeight={700}
          color={COLORS.TEXT}
        >
          Lost and Found
        </Typography>
        <Typography
          align="center"
          color="#666"
          sx={{ mb: 2, mt: 0.5, fontSize: 16 }}
        >
          Sign in to your account
        </Typography>

        {/* Login form */}
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ mt: 2, mb: 1, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Username"
            name="username"
            value={loginForm.username}
            onChange={handleLoginChange}
            fullWidth
            autoFocus
            InputProps={{
              sx: { bgcolor: COLORS.BACKGROUND },
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={loginForm.password}
            onChange={handleLoginChange}
            fullWidth
            InputProps={{
              sx: { bgcolor: COLORS.BACKGROUND },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: COLORS.BUTTON,
              color: COLORS.BUTTON_TEXT,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "none",
              py: 1.2,
              fontSize: 16,
            }}
          >
            Login
          </Button>
        </Box>

        {/* Register link */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="#888" fontSize={15}>
            Don't have an account?
          </Typography>
          <Button
            onClick={() => setRegisterOpen(true)}
            sx={{
              ml: 1,
              color: COLORS.ACCENT,
              fontWeight: 700,
              fontSize: 15,
              textTransform: "none",
              px: 0.5,
            }}
          >
            Register
          </Button>
        </Box>
      </Paper>

      {/* Registration Dialog */}
      <Dialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <form onSubmit={handleRegister}>
          <DialogTitle align="center" fontWeight={700}>
            Create an Account
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  name="username"
                  value={registerForm.username}
                  onChange={handleRegisterChange}
                  fullWidth
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={registerForm.phone}
                  onChange={handleRegisterChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ pb: 2, pr: 3 }}>
            <Button onClick={() => setRegisterOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: COLORS.BUTTON,
                color: COLORS.BUTTON_TEXT,
                fontWeight: 700,
                px: 4,
              }}
            >
              Register
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for errors and success */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError("")}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={2200}
        onClose={() => setSuccess("")}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
