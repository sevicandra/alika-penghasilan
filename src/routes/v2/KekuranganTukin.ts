import { Router } from "express";
import {
  getAllKekuranganTukin,
  getBulanKekuranganTukin,
  getKekuranganTukinById,
  getRekapKekuranganTukin,
  getTahunKekuranganTukin,
  countAllKekuranganTukin,
} from "@/controllers/v2/kekuranganTukin.controller";

const router = Router();
router.get("/", getAllKekuranganTukin);
router.get("/Count", countAllKekuranganTukin);
router.get("/GetTahun", getTahunKekuranganTukin);
router.get("/Tahun/:tahun/GetBulan", getBulanKekuranganTukin);
router.get("/GetRekap", getRekapKekuranganTukin);
router.get("/:id", getKekuranganTukinById);
export default router;
