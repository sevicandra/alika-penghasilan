import { Router } from "express";
import {
  getAllKekuranganGaji,
  getBulanKekuranganGaji,
  getKekuranganGajiById,
  getRekapKekuranganGaji,
  getTahunKekuranganGaji,
  countAllKekuranganGaji,
} from "@/controllers/v2/kekuranganGaji.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(["penghasilan2.gaji.read"]), getAllKekuranganGaji);
router.get(
  "/Count",
  authenticate(["penghasilan2.gaji.read"]),
  countAllKekuranganGaji
);
router.get(
  "/GetTahun",
  authenticate(["penghasilan2.gaji.read"]),
  getTahunKekuranganGaji
);
router.get(
  "/Tahun/:tahun/GetBulan",
  authenticate(["penghasilan2.gaji.read"]),
  getBulanKekuranganGaji
);
router.get(
  "/GetRekap",
  authenticate(["penghasilan2.gaji.read"]),
  getRekapKekuranganGaji
);
router.get(
  "/:id",
  authenticate(["penghasilan2.gaji.read"]),
  getKekuranganGajiById
);
export default router;
