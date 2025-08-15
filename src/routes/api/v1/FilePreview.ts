import { Router } from "express";
import { filePreview } from "@/controllers/v1/filePreview.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/:id", authenticate(["penghasilan.file.access"]), filePreview);

export default router;
