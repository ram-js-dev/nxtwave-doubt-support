import { Router } from "express";
import parseHeader from "../middlewares/parseHeader.middleware.js";
import { fetchAllTopics } from "../controllers/topic.controller.js";

const router = Router();

router.get("/", fetchAllTopics);

export default router;
