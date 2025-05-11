import { Router } from "express";
import {
    cetakKP4,
    previewKP4
} from "@/controllers/v1/kp4.controller";
const router = Router();

router.post("/Cetak", cetakKP4);
router.post("/Preview", previewKP4);
export default router;