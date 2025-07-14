import Topic from "../models/topic.model.js";

export const fetchAllTopics = async (req, res) => {
  const topics = await Topic.find();
  res.send({ data: topics });
};
