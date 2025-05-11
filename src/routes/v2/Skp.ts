import { Router } from "express";
import { previewSkp, cetakSkp } from "@/controllers/v2/skp.controller";

const router = Router();
router.post("/Preview", previewSkp);
router.post("/Cetak", cetakSkp);
export default router;
