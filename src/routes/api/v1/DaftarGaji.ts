import { Router } from "express";
import {
  previewDaftarGaji,
  cetakDaftarGaji,
} from "@/controllers/v1/daftarGaji.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.post(
  "/Preview",
  authenticate(["penghasilan.daftargaji.print"]),
  previewDaftarGaji
);
router.post(
  "/Cetak",
  authenticate(["penghasilan.daftargaji.submit"]),
  cetakDaftarGaji
);
export default router;
