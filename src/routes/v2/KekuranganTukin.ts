import { Router } from "express";
import {
  getAllKekuranganTukin,
  getBulanKekuranganTukin,
  getKekuranganTukinById,
  getRekapKekuranganTukin,
  getTahunKekuranganTukin,
  countAllKekuranganTukin,
} from "@/controllers/v2/kekuranganTukin.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get(
  "/",
  authenticate(["penghasilan2.tukin.read"]),
  getAllKekuranganTukin
);
router.get(
  "/Count",
  authenticate(["penghasilan2.tukin.read"]),
  countAllKekuranganTukin
);
router.get(
  "/GetTahun",
  authenticate(["penghasilan2.tukin.read"]),
  getTahunKekuranganTukin
);
router.get(
  "/Tahun/:tahun/GetBulan",
  authenticate(["penghasilan2.tukin.read"]),
  getBulanKekuranganTukin
);
router.get(
  "/GetRekap",
  authenticate(["penghasilan2.tukin.read"]),
  getRekapKekuranganTukin
);
router.get(
  "/:id",
  authenticate(["penghasilan2.tukin.read"]),
  getKekuranganTukinById
);
export default router;
