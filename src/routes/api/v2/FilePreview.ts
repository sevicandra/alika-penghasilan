import { Router } from "express";
import { filePreview } from "@/controllers/v2/filePreview.controller";

const router = Router();

router.get("/:id", filePreview);

export default router;
