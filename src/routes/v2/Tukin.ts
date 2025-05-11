import { Router } from "express";
import {
  getAllTukin,
  getBulanTukin,
  getTukinById,
  getRekapKekuranganTukin,
  getTahunTukin,
  countAllTukin,
} from "@/controllers/v2/tukin.controller";

const router = Router();
router.get("/", getAllTukin);
router.get("/Count", countAllTukin);
router.get("/GetTahun", getTahunTukin);
router.get("/Tahun/:tahun/GetBulan", getBulanTukin);
router.get("/GetRekap", getRekapKekuranganTukin);
router.get("/:id", getTukinById);
export default router;
