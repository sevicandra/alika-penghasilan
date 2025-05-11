import { Router } from "express";
import { previewSkp, cetakSkp } from "@/controllers/v1/skp.controller";

const router = Router();
router.post("/Preview", previewSkp);
router.post("/Cetak", cetakSkp);
export default router;
