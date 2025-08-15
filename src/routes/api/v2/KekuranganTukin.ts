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
router.get("/", authenticate(), getAllKekuranganTukin);
router.get("/Count", authenticate(), countAllKekuranganTukin);
router.get("/GetTahun", authenticate(), getTahunKekuranganTukin);
router.get("/Tahun/:tahun/GetBulan", authenticate(), getBulanKekuranganTukin);
router.get("/GetRekap", authenticate(), getRekapKekuranganTukin);
router.get("/:id", authenticate(), getKekuranganTukinById);
export default router;
