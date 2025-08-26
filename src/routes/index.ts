import { Router } from "express";
import download from "./download";
import api from "./api";
const router = Router();

router.use("/download", download);
router.use("/api", api);

export default router;
