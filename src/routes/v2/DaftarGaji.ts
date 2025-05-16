import { Router } from "express";
import {
  previewDaftarGaji,
  cetakDaftarGaji,
} from "@/controllers/v2/daftarGaji.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.post(
  "/Preview",
  authenticate(["penghasilan2.daftargaji.print"]),
  previewDaftarGaji
);
router.post(
  "/Cetak",
  authenticate(["penghasilan2.daftargaji.print"]),
  cetakDaftarGaji
);

export default router;
