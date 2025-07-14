import { Router } from "express";
import {
  createDoubt,
  deleteDoubt,
  editDoubt,
  fetchAllDoubts,
  patchDoubt,
} from "../controllers/doubt.controller.js";
import parseHeader from "../middlewares/parseHeader.middleware.js";

const router = Router();
router.use(parseHeader);
router.route("/").get(fetchAllDoubts).post(createDoubt);
router.route("/:doubtId").patch(patchDoubt).put(editDoubt).delete(deleteDoubt);

export default router;
