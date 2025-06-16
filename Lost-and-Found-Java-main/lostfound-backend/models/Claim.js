const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  claimReason: { type: String, required: true },
  contactInfo: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  claimDate: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Claim", claimSchema);