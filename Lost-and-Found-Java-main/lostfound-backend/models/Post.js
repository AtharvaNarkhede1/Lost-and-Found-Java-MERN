const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image_path: { type: String }, // Hosted on Cloudinary
  location: { type: String },
  dateFound: { type: Date },
  isApproved: { type: Boolean, default: false },
  isClaimed: { type: Boolean, default: false },
  postDate: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Post", postSchema);