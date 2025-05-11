import { Router } from "express";
import {
  getAllUangLembur,
  getBulanUangLembur,
  getRekapUangLembur,
  getTahunUangLembur,
  getUangLemburById,
  countAllUangLembur,
} from "@/controllers/v2/uangLembur.controller";

const router = Router();
router.get("/", getAllUangLembur);
router.get("/Count", countAllUangLembur);
router.get("/GetTahun", getTahunUangLembur);
router.get("/Tahun/:tahun/GetBulan", getBulanUangLembur);
router.get("/GetRekap", getRekapUangLembur);
router.get("/:id", getUangLemburById);
export default router;
