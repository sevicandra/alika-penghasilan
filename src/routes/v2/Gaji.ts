import { Router } from "express";
import {
  getAllGaji,
  getGajiById,
  countAllGaji,
  getBulanGaji,
  getRekapGaji,
  getTahunGaji,
} from "@/controllers/v2/gaji.controller";

const router = Router();
router.get("/", getAllGaji);
router.get("/Count", countAllGaji);
router.get("/GetTahun", getTahunGaji);
router.get("/Tahun/:tahun/GetBulan", getBulanGaji);
router.get("/GetRekap", getRekapGaji);
router.get("/:id", getGajiById);
export default router;
