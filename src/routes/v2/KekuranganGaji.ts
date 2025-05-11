import { Router } from "express";
import {
  getAllKekuranganGaji,
  getBulanKekuranganGaji,
  getKekuranganGajiById,
  getRekapKekuranganGaji,
  getTahunKekuranganGaji,
  countAllKekuranganGaji,
} from "@/controllers/v2/kekuranganGaji.controller";

const router = Router();
router.get("/", getAllKekuranganGaji);
router.get("/Count", countAllKekuranganGaji);
router.get("/GetTahun", getTahunKekuranganGaji);
router.get("/Tahun/:tahun/GetBulan", getBulanKekuranganGaji);
router.get("/GetRekap", getRekapKekuranganGaji);
router.get("/:id", getKekuranganGajiById);
export default router;
