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
router.get("/", authenticate(), getAllKekuranganGaji);
router.get("/Count", authenticate(), countAllKekuranganGaji);
router.get("/GetTahun", authenticate(), getTahunKekuranganGaji);
router.get("/Tahun/:tahun/GetBulan", authenticate(), getBulanKekuranganGaji);
router.get("/GetRekap", authenticate(), getRekapKekuranganGaji);
router.get("/:id", authenticate(), getKekuranganGajiById);
export default router;
