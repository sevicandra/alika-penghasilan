import { Router } from "express";
import {
  getAllUangMakan,
  getBulanUangMakan,
  getRekapUangMakan,
  getTahunUangMakan,
  getUangMakanById,
  countAllUangMakan,
} from "@/controllers/v2/uangMakan.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(), getAllUangMakan);
router.get("/Count", authenticate(), countAllUangMakan);
router.get("/GetTahun", authenticate(), getTahunUangMakan);
router.get("/Tahun/:tahun/GetBulan", authenticate(), getBulanUangMakan);
router.get("/GetRekap", authenticate(), getRekapUangMakan);
router.get("/:id", authenticate(), getUangMakanById);
export default router;
