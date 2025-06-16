import React, { useEffect, useState } from "react";
import axios from "axios";

// --- Styling (You can move this to a CSS file for larger apps)
const styles = {
  background: "#fff",
  accent: "#37352f",
  border: "#ebebeb",
  card: "#fafafa",
  button: "#37352f",
  text: "#191919",
  hover: "#f5f5f5",
  fieldBg: "#fbfbfa",
  claimed: "#fff0f0",
  claimedBorder: "#ffc8c8",
};

function MainView({ currentUser, onLogout, onOpenPostCreation }) {
  const [posts, setPosts] = useState([]);
  const [showMine, setShowMine] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [claimModal, setClaimModal] = useState(false);

  // Load posts (all or mine)
  const loadPosts = async () => {
    try {
      let res;
      if (showMine) {
        res = await axios.get(
          `http://localhost:5000/api/posts?userId=${currentUser.userId}`
        );
      } else {
        res = await axios.get("http://localhost:5000/api/posts?isApproved=true");
      }
      setPosts(res.data.reverse());
      setSelectedPost(null);
    } catch (err) {
      alert("Failed to load posts");
    }
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line
  }, [showMine]);

  // Claim submission
  const submitClaim = async (reason, contact) => {
    try {
      await axios.post("http://localhost:5000/api/claims", {
        postId: selectedPost._id,
        userId: currentUser.userId,
        claimReason: reason,
        contactInfo: contact,
      });
      alert("Your claim has been submitted and is pending approval.");
      setClaimModal(false);
      loadPosts();
    } catch (err) {
      alert("Failed to submit claim.");
    }
  };

  // UI
  return (
    <div
      style={{
        minHeight: "100vh",
        background: styles.background,
        color: styles.text,
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: `1px solid ${styles.border}`,
          padding: "24px 24px 8px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontStyle: "italic", fontSize: 18 }}>
          Welcome, <b>{currentUser.username}</b>
        </span>
        <div>
          {/* Toggle buttons for All Posts and My Posts */}
          <button
            style={{
              marginRight: 12,
              background: !showMine ? styles.accent : "#f0f0f0",
              color: !showMine ? "#fff" : styles.text,
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              cursor: "pointer",
              fontStyle: "italic",
            }}
            onClick={() => setShowMine(false)}
          >
            All Posts
          </button>
          <button
            style={{
              marginRight: 12,
              background: showMine ? styles.accent : "#f0f0f0",
              color: showMine ? "#fff" : styles.text,
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              cursor: "pointer",
              fontStyle: "italic",
            }}
            onClick={() => setShowMine(true)}
          >
            My Posts
          </button>
          <button
            style={{
              marginRight: 12,
              background: styles.button,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              cursor: "pointer",
              fontStyle: "italic",
            }}
            onClick={onOpenPostCreation}
          >
            Report Found Item
          </button>
          <button
            style={{
              background: "#f0f0f0",
              color: styles.text,
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              cursor: "pointer",
              fontStyle: "italic",
            }}
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          height: "calc(100vh - 64px)",
          background: styles.background,
        }}
      >
        {/* Left: List */}
        <div
          style={{
            width: 350,
            borderRight: `1px solid ${styles.border}`,
            padding: 24,
            overflowY: "auto",
          }}
        >
          <h2 style={{ color: styles.text, margin: 0, marginBottom: 16 }}>
            Found Items
          </h2>
          <button
            style={{
              background: "#f0f0f0",
              color: styles.text,
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              marginBottom: 16,
              cursor: "pointer",
              fontStyle: "italic",
            }}
            onClick={loadPosts}
          >
            Refresh
          </button>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {posts.map((p) => (
              <li
                key={p._id}
                style={{
                  background:
                    selectedPost && selectedPost._id === p._id
                      ? styles.hover
                      : styles.background,
                  border: `1px solid ${styles.border}`,
                  borderRadius: 8,
                  padding: "14px 12px",
                  marginBottom: 10,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
                onClick={() => setSelectedPost(p)}
              >
                <span style={{ color: styles.accent }}>{p.title}</span>
                <div style={{ fontSize: 13, color: "#7a7a7a" }}>
                  {p.location} | {new Date(p.dateFound).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Right: Details */}
        <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          <h2 style={{ color: styles.text, margin: 0, marginBottom: 16 }}>
            Item Details
          </h2>
          {selectedPost ? (
            <div
              style={{
                background: styles.card,
                border: `1px solid ${styles.border}`,
                borderRadius: 12,
                padding: 24,
                maxWidth: 520,
              }}
            >
              <h3 style={{ color: styles.text }}>{selectedPost.title}</h3>
              <div style={{ fontStyle: "italic", color: "#555", marginBottom: 4 }}>
                Posted by: {selectedPost.username}
              </div>
              <div style={{ fontStyle: "italic", color: "#555", marginBottom: 4 }}>
                Date Found: {new Date(selectedPost.dateFound).toLocaleDateString()}
              </div>
              <div style={{ fontStyle: "italic", color: "#555", marginBottom: 16 }}>
                Location: {selectedPost.location}
              </div>
              <b>Description:</b>
              <div
                style={{
                  marginBottom: 16,
                  background: styles.fieldBg,
                  borderRadius: 8,
                  padding: 10,
                }}
              >
                {selectedPost.description}
              </div>
              {selectedPost.image_path && (
                <>
                  <b>Image:</b>
                  <div>
                    <img
                      src={selectedPost.image_path}
                      alt="item"
                      style={{
                        marginTop: 8,
                        borderRadius: 8,
                        border: `1px solid ${styles.border}`,
                        maxWidth: "100%",
                        maxHeight: 300,
                      }}
                    />
                  </div>
                </>
              )}
              {selectedPost.isClaimed && (
                <div
                  style={{
                    marginTop: 16,
                    background: styles.claimed,
                    border: `1px solid ${styles.claimedBorder}`,
                    borderRadius: 8,
                    padding: 12,
                    color: "#c00",
                    fontWeight: 600,
                  }}
                >
                  THIS ITEM HAS BEEN CLAIMED
                </div>
              )}
              {/* Claim button */}
              <div style={{ marginTop: 24 }}>
                <button
                  style={{
                    background: styles.button,
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 24px",
                    cursor: "pointer",
                    fontStyle: "italic",
                  }}
                  disabled={selectedPost.isClaimed}
                  onClick={() => setClaimModal(true)}
                >
                  This is Mine
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: "#aaa", fontSize: 18, marginTop: 48 }}>
              Select a post to see details.
            </div>
          )}
        </div>
      </div>
      {/* Claim Modal */}
      {claimModal && selectedPost && (
        <ClaimModal
          onClose={() => setClaimModal(false)}
          onSubmit={submitClaim}
        />
      )}
    </div>
  );
}

// ----- Claim Modal Component -----
function ClaimModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      alert("Please provide a reason for your claim.");
      return;
    }
    setSubmitting(true);
    await onSubmit(reason, contact);
    setSubmitting(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        zIndex: 99,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <form
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 14,
          minWidth: 360,
          boxShadow: "0 2px 24px rgba(0,0,0,0.10)",
        }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>Claim This Item</h2>
        <label style={{ fontStyle: "italic" }}>
          Please explain why you believe this item belongs to you:
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            marginTop: 4,
            marginBottom: 12,
            padding: 10,
            border: `1px solid #ebebeb`,
            borderRadius: 6,
            background: "#fbfbfa",
            fontSize: 15,
          }}
        />
        <label style={{ fontStyle: "italic" }}>
          Contact information for the finder to reach you:
        </label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          style={{
            width: "100%",
            marginTop: 4,
            marginBottom: 16,
            padding: 10,
            border: `1px solid #ebebeb`,
            borderRadius: 6,
            background: "#fbfbfa",
            fontSize: 15,
          }}
        />
        <button
          type="submit"
          style={{
            background: "#37352f",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "10px 24px",
            cursor: "pointer",
            fontStyle: "italic",
            marginRight: 12,
          }}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Claim"}
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "#f0f0f0",
            color: "#191919",
            border: "none",
            borderRadius: 6,
            padding: "10px 24px",
            cursor: "pointer",
            fontStyle: "italic",
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default MainView;