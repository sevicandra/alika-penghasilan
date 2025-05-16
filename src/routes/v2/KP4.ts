import { Router } from "express";
import {
    cetakKP4,
    previewKP4
} from "@/controllers/v2/kp4.controller";
const router = Router();
import { authenticate } from "@/middlewares/auth.middleware";

router.post("/Cetak", authenticate(["penghasilan2.kp4.print"]),cetakKP4);
router.post("/Preview", authenticate(["penghasilan2.kp4.submit"]),previewKP4);
export default router;