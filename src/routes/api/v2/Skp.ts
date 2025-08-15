import { Router } from "express";
import { previewSkp, cetakSkp } from "@/controllers/v2/skp.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.post("/Preview", authenticate(),previewSkp);
router.post("/Cetak", authenticate(),cetakSkp);
export default router;
