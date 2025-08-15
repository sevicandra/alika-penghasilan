import { Router } from "express";
import { filePreview } from "@/controllers/v2/filePreview.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/:id", authenticate(), filePreview);

export default router;
