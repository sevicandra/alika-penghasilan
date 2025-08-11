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
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(), getAllPenghasilanLain);
router.get("/Count", authenticate(), countAllPenghasilanLain);
router.get("/GetTahun", authenticate(), getTahunPenghasilanLain);
router.get("/Tahun/:tahun/GetBulan", authenticate(), getBulanPenghasilanLain);
router.get("/GetJenis", authenticate(), getJenisPenghasilanLain);
router.get("/GetRekap", authenticate(), getRekapPenghasilanLain);
router.get("/:id", authenticate(), getPenghasilanLainById);
export default router;
