import { Router } from "express";
import {
    previewDaftarGaji,
    cetakDaftarGaji
} from "@/controllers/v2/daftarGaji.controller";

const router = Router();
router.post("/Preview", previewDaftarGaji);
router.post("/Cetak", cetakDaftarGaji);

export default router;