import { Router } from "express";
import {
    cetakKP4,
    previewKP4
} from "@/controllers/v1/kp4.controller";
const router = Router();
import { authenticate } from "@/middlewares/auth.middleware";
router.post("/Cetak", authenticate(["penghasilan.kp4.submit"]), cetakKP4);
router.post("/Preview", authenticate(["penghasilan.kp4.print"]), previewKP4);
export default router;