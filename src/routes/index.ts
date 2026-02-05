import { Router } from "express";
import { authenticate } from "@/middlewares/authenticate.middleware";
import api from "./api";
import download from "./download";

const router = Router();

router.use("/download", download);
router.use("/api", authenticate, api);

export default router;
