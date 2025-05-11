import { Router } from "express";
import {
  getAllPenghasilanLain,
  getBulanPenghasilanLain,
  getJenisPenghasilanLain,
  getPenghasilanLainById,
  getRekapPenghasilanLain,
  getTahunPenghasilanLain,
  countAllPenghasilanLain,
} from "@/controllers/v2/penghasilanLain.controller";

const router = Router();
router.get("/", getAllPenghasilanLain);
router.get("/Count", countAllPenghasilanLain);
router.get("/GetTahun", getTahunPenghasilanLain);
router.get("/Tahun/:tahun/GetBulan", getBulanPenghasilanLain);
router.get("/GetJenis", getJenisPenghasilanLain);
router.get("/GetRekap", getRekapPenghasilanLain);
router.get("/:id", getPenghasilanLainById);
export default router;
