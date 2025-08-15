import { Router } from "express";
import {
  previewDaftarGaji,
  cetakDaftarGaji,
} from "@/controllers/v2/daftarGaji.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.post("/Preview", authenticate(), previewDaftarGaji);
router.post("/Cetak", authenticate(), cetakDaftarGaji);

export default router;
