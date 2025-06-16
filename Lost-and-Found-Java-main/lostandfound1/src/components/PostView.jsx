import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";


// Notion-like colors
const COLORS = {
  BACKGROUND: "#fff",
  TEXT: "#191919",
  ACCENT: "#37352f",
  BORDER: "#ebebeb",
  FIELD_BG: "#fbfbfa",
};

export default function PostView({ open, onClose, currentUser, onSuccess }) {
  const [fields, setFields] = useState({
    title: "",
    description: "",
    location: "",
    dateFound: new Date().toISOString().substring(0, 10),
    image: null,
    imagePath: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFields((f) => ({
        ...f,
        image: files[0],
        imagePath: files[0] ? files[0].name : "",
      }));
    } else {
      setFields((f) => ({ ...f, [name]: value }));
    }
  };

  // Browse for image
  const handleBrowseClick = () => {
    document.getElementById("post-image-input").click();
  };

  // Submit post
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const { title, description, location, dateFound, image } = fields;
    if (!title || !description || !location) {
      setError("Please fill in all required fields (Title, Description, Location).");
      return;
    }
    if (!currentUser?.userId) {
      setError("User authentication error: userId missing.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("dateFound", dateFound);
    if (image) formData.append("image", image);
    // Only append userId if it's present and valid
    formData.append("userId", currentUser.userId);

    try {
      await axios.post("https://lost-and-found-java-mern-1.onrender.com/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Your post has been submitted and is pending approval.");
      setTimeout(() => {
        setSuccess("");
        onSuccess && onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to submit post. Please try again."
      );
    }
  };

  // Reset form on close
  React.useEffect(() => {
    if (!open) {
      setFields({
        title: "",
        description: "",
        location: "",
        dateFound: new Date().toISOString().substring(0, 10),
        image: null,
        imagePath: "",
      });
      setError("");
      setSuccess("");
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="body">
      <DialogTitle sx={{ bgcolor: COLORS.BACKGROUND, color: COLORS.TEXT, borderBottom: `1px solid ${COLORS.BORDER}` }}>
        <Typography variant="h5" fontWeight={600} color={COLORS.TEXT}>
          Report a Found Item
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: COLORS.BACKGROUND, pt: 3, pb: 1 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Title"
            name="title"
            value={fields.title}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              sx: { bgcolor: COLORS.FIELD_BG },
            }}
          />
          <TextField
            label="Description"
            name="description"
            value={fields.description}
            onChange={handleChange}
            fullWidth
            required
            multiline
            minRows={4}
            InputProps={{
              sx: { bgcolor: COLORS.FIELD_BG },
            }}
          />
          <TextField
            label="Location"
            name="location"
            value={fields.location}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              sx: { bgcolor: COLORS.FIELD_BG },
            }}
          />
          <TextField
            label="Date Found"
            name="dateFound"
            type="date"
            value={fields.dateFound}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              sx: { bgcolor: COLORS.FIELD_BG },
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              label="Image"
              name="imagePath"
              value={fields.imagePath}
              placeholder="No file chosen"
              fullWidth
              InputProps={{
                readOnly: true,
                sx: { bgcolor: COLORS.FIELD_BG },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={handleBrowseClick}
                      aria-label="browse image"
                    >
                      <PhotoCamera />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <input
              id="post-image-input"
              name="image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleChange}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ bgcolor: COLORS.BACKGROUND, borderTop: `1px solid ${COLORS.BORDER}`, p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: COLORS.ACCENT,
            color: "#fff",
            fontWeight: "bold",
            textTransform: "none",
            ml: 1,
          }}
        >
          Submit
        </Button>
      </DialogActions>
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
        autoHideDuration={2000}
        onClose={() => setSuccess("")}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
