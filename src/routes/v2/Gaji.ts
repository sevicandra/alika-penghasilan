import { Router } from "express";
import {
  getAllGaji,
  getGajiById,
  countAllGaji,
  getBulanGaji,
  getRekapGaji,
  getTahunGaji,
} from "@/controllers/v2/gaji.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(), getAllGaji);
router.get("/Count", authenticate(), countAllGaji);
router.get("/GetTahun", authenticate(), getTahunGaji);
router.get("/Tahun/:tahun/GetBulan", authenticate(), getBulanGaji);
router.get("/GetRekap", authenticate(), getRekapGaji);
router.get("/:id", authenticate(), getGajiById);
export default router;
