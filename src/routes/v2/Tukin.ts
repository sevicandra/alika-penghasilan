import { Router } from "express";
import {
  getAllTukin,
  getBulanTukin,
  getTukinById,
  getRekapKekuranganTukin,
  getTahunTukin,
  countAllTukin,
} from "@/controllers/v2/tukin.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(),getAllTukin);
router.get("/Count", authenticate(),countAllTukin);
router.get("/GetTahun", authenticate(),getTahunTukin);
router.get("/Tahun/:tahun/GetBulan", authenticate(),getBulanTukin);
router.get("/GetRekap", authenticate(),getRekapKekuranganTukin);
router.get("/:id", authenticate(),getTukinById);
export default router;
