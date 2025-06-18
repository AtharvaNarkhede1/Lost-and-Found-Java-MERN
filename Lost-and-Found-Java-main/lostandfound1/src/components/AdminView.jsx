import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Grid,
  Card,
  CardMedia,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

// Notion-like colors
const COLORS = {
  BACKGROUND: "#fff",
  TEXT: "#191919",
  ACCENT: "#37352f",
  BORDER: "#ebebeb",
  HOVER: "#f5f5f5",
  BUTTON: "#37352f",
  BUTTON_TEXT: "#fff",
};

// Helpers
function truncate(text, len) {
  if (!text) return "";
  return text.length > len ? text.substring(0, len) + "..." : text;
}

function PostListItem({ post, selected, onClick }) {
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      sx={{
        borderBottom: `1px solid ${COLORS.BORDER}`,
        alignItems: "flex-start",
        bgcolor: selected ? COLORS.HOVER : COLORS.BACKGROUND,
      }}
    >
      <ListItemText
        primary={
          <span style={{ fontWeight: 600, color: COLORS.TEXT }}>{post.title}</span>
        }
        secondary={
          <span style={{ color: COLORS.TEXT }}>
            By: {post.username} | Location: {post.location}
            {post.isClaimed ? (
              <span style={{ color: "#c96c00", fontWeight: 500 }}> | CLAIMED</span>
            ) : null}
          </span>
        }
      />
    </ListItemButton>
  );
}

function ClaimListItem({ claim, selected, onClick }) {
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      sx={{
        borderBottom: `1px solid ${COLORS.BORDER}`,
        alignItems: "flex-start",
        bgcolor: selected ? COLORS.HOVER : COLORS.BACKGROUND,
      }}
    >
      <ListItemText
        primary={
          <span style={{ fontWeight: 500, color: COLORS.TEXT }}>
            Claim #{claim._id}
          </span>
        }
        secondary={
          <span style={{ color: COLORS.TEXT }}>
            User: {claim.username || claim.userId}
            <br />
            <em>{truncate(claim.claimReason || claim.reason, 50)}</em>
          </span>
        }
      />
    </ListItemButton>
  );
}

function PostDetails({ post }) {
  if (!post) {
    return (
      <Paper
        elevation={0}
        sx={{
          minHeight: 200,
          bgcolor: COLORS.BACKGROUND,
          color: COLORS.TEXT,
          p: 3,
        }}
      >
        <Typography>No post selected.</Typography>
      </Paper>
    );
  }
  return (
    <Card
      sx={{
        display: "flex",
        bgcolor: COLORS.BACKGROUND,
        border: `1px solid ${COLORS.BORDER}`,
        mb: 2,
        minHeight: 200,
      }}
      elevation={0}
    >
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          {post.title}
        </Typography>
        <Typography variant="body2" color="#444" sx={{ mb: 1 }}>
          By: {post.username} | Date Found: {post.dateFound ? new Date(post.dateFound).toLocaleDateString() : ""}
        </Typography>
        <Typography variant="body2" color="#444" sx={{ mb: 1 }}>
          Location: {post.location}
        </Typography>
        <Typography variant="body1" color={COLORS.TEXT} sx={{ mb: 1 }}>
          {post.description}
        </Typography>
        {post.isClaimed && (
          <Typography color="#c96c00" fontWeight={600} sx={{ mt: 1 }}>
            *** THIS ITEM HAS BEEN CLAIMED ***
          </Typography>
        )}
      </Box>
      <Box sx={{ width: 300, minHeight: 180, p: 2 }}>
        {post.image_path ? (
          <CardMedia
            component="img"
            src={post.image_path}
            alt="Post image"
            sx={{ objectFit: "contain", maxHeight: 180, borderRadius: 2 }}
          />
        ) : (
          <Paper
            sx={{
              height: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: COLORS.BACKGROUND,
              border: `1px solid ${COLORS.BORDER}`,
            }}
            elevation={0}
          >
            <Typography color="#aaa" fontStyle="italic">
              No image available
            </Typography>
          </Paper>
        )}
      </Box>
    </Card>
  );
}

export default function AdminView({ admin, onLogout }) {
  const [tab, setTab] = useState(0); // 0: pending, 1: approved
  const [pendingPosts, setPendingPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [selectedPending, setSelectedPending] = useState(null);
  const [selectedApproved, setSelectedApproved] = useState(null);
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  
  // Fetch posts
  const fetchPosts = async () => {
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        axios.get("https://lost-and-found-java-mern.onrender.com/api/admin/posts/pending"),
        axios.get("https://lost-and-found-java-mern.onrender.com/api/admin/posts/approved"),
      ]);
      setPendingPosts(pendingRes.data || []);
      setApprovedPosts(approvedRes.data || []);
      setSelectedPending(null);
      setSelectedApproved(null);
      setClaims([]);
    } catch {
      setSnackbar({ open: true, message: "Failed to load posts.", severity: "error" });
    }
  };

  // Fetch claims for a post
  const fetchClaims = async (postId) => {
    try {
      const res = await axios.get(`/api/admin/posts/${postId}/claims`);
      setClaims(res.data || []);
      setSelectedClaim(null);
    } catch {
      setClaims([]);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  // When post selection changes, load claims
  useEffect(() => {
    const post =
      tab === 0
        ? pendingPosts.find((p) => p._id === selectedPending)
        : approvedPosts.find((p) => p._id === selectedApproved);
    if (post) fetchClaims(post._id);
    else setClaims([]);
    // eslint-disable-next-line
  }, [tab, selectedPending, selectedApproved]);

  // Approve/reject post
  const handleApproveReject = async (approve) => {
    const selectedPostId = tab === 0 ? selectedPending : null;
    if (!selectedPostId) {
      setSnackbar({ open: true, message: "Please select a pending post.", severity: "warning" });
      return;
    }
    try {
      await axios.patch(`/api/admin/posts/${selectedPostId}/approve`, { approve });
      setSnackbar({
        open: true,
        message: `Post ${approve ? "approved" : "rejected"} successfully.`,
        severity: "success",
      });
      fetchPosts();
    } catch {
      setSnackbar({ open: true, message: `Failed to ${approve ? "approve" : "reject"} post.`, severity: "error" });
    }
  };

  // Approve/reject claim
  const handleApproveRejectClaim = async (approve) => {
    if (!selectedClaim) {
      setSnackbar({ open: true, message: "Please select a claim.", severity: "warning" });
      return;
    }
    try {
      if (approve) {
        await axios.patch(`/api/admin/claims/${selectedClaim}/approve`);
      } else {
        await axios.delete(`/api/admin/claims/${selectedClaim}`);
      }
      setSnackbar({
        open: true,
        message: `Claim ${approve ? "approved" : "rejected"} successfully.`,
        severity: "success",
      });
      // Reload claims and posts
      const postId =
        tab === 0
          ? pendingPosts.find((p) => p._id === selectedPending)?._id
          : approvedPosts.find((p) => p._id === selectedApproved)?._id;
      if (postId) fetchClaims(postId);
      fetchPosts();
    } catch {
      setSnackbar({ open: true, message: `Failed to ${approve ? "approve" : "reject"} claim.`, severity: "error" });
    }
  };

  // Selected post object
  const selectedPost =
    tab === 0
      ? pendingPosts.find((p) => p._id === selectedPending)
      : approvedPosts.find((p) => p._id === selectedApproved);

  return (
    <Box sx={{ bgcolor: COLORS.BACKGROUND, minHeight: "100vh", p: 0 }}>
      {/* Top Bar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: COLORS.BACKGROUND, color: COLORS.TEXT, borderBottom: `1px solid ${COLORS.BORDER}` }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, Admin {admin?.username || ""}
          </Typography>
          <Button variant="outlined" color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      {/* Main Split */}
      <Grid container spacing={0} sx={{ p: 4, height: "calc(100vh - 64px)" }}>
        {/* Left Column (Posts) */}
        <Grid item xs={4} sx={{ pr: 2, borderRight: `1px solid ${COLORS.BORDER}` }}>
          <Tabs
            value={tab}
            onChange={(_, t) => {
              setTab(t);
              setSelectedPending(null);
              setSelectedApproved(null);
              setClaims([]);
            }}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 2 }}
          >
            <Tab label="Pending Posts" />
            <Tab label="Approved Posts" />
          </Tabs>
          {tab === 0 ? (
            <>
              <List sx={{ bgcolor: COLORS.BACKGROUND, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2, maxHeight: "56vh", overflowY: "auto" }}>
                {pendingPosts.map((post) => (
                  <PostListItem
                    key={post._id}
                    post={post}
                    selected={selectedPending === post._id}
                    onClick={() => {
                      setSelectedPending(post._id);
                      setSelectedApproved(null);
                    }}
                  />
                ))}
                {pendingPosts.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No pending posts to approve." />
                  </ListItem>
                )}
              </List>
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: COLORS.BUTTON, color: COLORS.BUTTON_TEXT, flex: 1 }}
                  onClick={() => handleApproveReject(true)}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: COLORS.BUTTON, color: COLORS.BUTTON_TEXT, flex: 1 }}
                  onClick={() => handleApproveReject(false)}
                >
                  Reject
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={fetchPosts}
                  sx={{ flex: 1 }}
                >
                  Refresh
                </Button>
              </Box>
            </>
          ) : (
            <>
              <List sx={{ bgcolor: COLORS.BACKGROUND, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2, maxHeight: "56vh", overflowY: "auto" }}>
                {approvedPosts.map((post) => (
                  <PostListItem
                    key={post._id}
                    post={post}
                    selected={selectedApproved === post._id}
                    onClick={() => {
                      setSelectedApproved(post._id);
                      setSelectedPending(null);
                    }}
                  />
                ))}
                {approvedPosts.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No approved posts available." />
                  </ListItem>
                )}
              </List>
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={fetchPosts}
                  sx={{ flex: 1 }}
                >
                  Refresh
                </Button>
              </Box>
            </>
          )}
        </Grid>
        {/* Right Column (Details + Claims) */}
        <Grid item xs={8} sx={{ pl: 4 }}>
          {/* Post Details */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Post Details
          </Typography>
          <PostDetails post={selectedPost} />
          {/* Claims */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
            Claims
          </Typography>
          <Paper
            sx={{
              minHeight: 120,
              border: `1px solid ${COLORS.BORDER}`,
              borderRadius: 2,
              mb: 2,
              bgcolor: COLORS.BACKGROUND,
            }}
            elevation={0}
          >
            <List sx={{ maxHeight: 160, overflowY: "auto" }}>
              {claims.length > 0 ? (
                claims.map((claim) => (
                  <ClaimListItem
                    key={claim._id}
                    claim={claim}
                    selected={selectedClaim === claim._id}
                    onClick={() => setSelectedClaim(claim._id)}
                  />
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No claims for this post." />
                </ListItem>
              )}
            </List>
            <Box sx={{ p: 1, display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                sx={{ bgcolor: COLORS.BUTTON, color: COLORS.BUTTON_TEXT, flex: 1 }}
                onClick={() => handleApproveRejectClaim(true)}
              >
                Approve Claim
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: COLORS.BUTTON, color: COLORS.BUTTON_TEXT, flex: 1 }}
                onClick={() => handleApproveRejectClaim(false)}
              >
                Reject Claim
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  if (selectedPost?._id) fetchClaims(selectedPost._id);
                }}
                sx={{ flex: 1 }}
              >
                Refresh Claims
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2800}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
