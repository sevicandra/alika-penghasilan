import { Router } from "express";
import { previewSkp, cetakSkp } from "@/controllers/v1/skp.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.post("/Preview", authenticate(["penghasilan.skp.print"]), previewSkp);
router.post("/Cetak", authenticate(["penghasilan.skp.submit"]), cetakSkp);
export default router;
