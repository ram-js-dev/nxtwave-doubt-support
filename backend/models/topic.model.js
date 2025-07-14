import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Topic name is requried"] },
    liveURL: { type: String, required: [true, "Live URL is required"] },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const topic = mongoose.model("Topic", topicSchema);

export default topic;
