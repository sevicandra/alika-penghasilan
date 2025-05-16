import { Router } from "express";
import { previewSkp, cetakSkp } from "@/controllers/v2/skp.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.post("/Preview", authenticate(["penghasilan2.skp.print"]),previewSkp);
router.post("/Cetak", authenticate(["penghasilan2.skp.submit"]),cetakSkp);
export default router;
