import { Router } from "express";
import {
  getAllUangLembur,
  getBulanUangLembur,
  getRekapUangLembur,
  getTahunUangLembur,
  getUangLemburById,
  countAllUangLembur,
} from "@/controllers/v2/uangLembur.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(), getAllUangLembur);
router.get("/Count", authenticate(), countAllUangLembur);
router.get("/GetTahun", authenticate(), getTahunUangLembur);
router.get("/Tahun/:tahun/GetBulan", authenticate(), getBulanUangLembur);
router.get("/GetRekap", authenticate(), getRekapUangLembur);
router.get("/:id", authenticate(), getUangLemburById);
export default router;
