import mongoose from "mongoose";

import { DOUBT_STATE } from "../constants.js";

const doubtSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Description is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    questionURL: String,
    discussionURL: String,
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "PostedBy ID is required"],
    },
    resolvedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: [DOUBT_STATE.resolved, DOUBT_STATE.pending],
      default: DOUBT_STATE.pending,
    },
    isInvited: {
      type: Boolean,
      default: false,
    },
    topic: {
      type: mongoose.Types.ObjectId,
      ref: "Topic",
      required: [true, "Topic is required"],
    },
  },
  { timestamps: true }
);

const doubt = mongoose.model("Doubt", doubtSchema);

export default doubt;
