import { Router } from "express";
import {
  getAllUangMakan,
  getBulanUangMakan,
  getRekapUangMakan,
  getTahunUangMakan,
  getUangMakanById,
  countAllUangMakan,
} from "@/controllers/v2/uangMakan.controller";

const router = Router();
router.get("/", getAllUangMakan);
router.get("/Count", countAllUangMakan);
router.get("/GetTahun", getTahunUangMakan);
router.get("/Tahun/:tahun/GetBulan", getBulanUangMakan);
router.get("/GetRekap", getRekapUangMakan);
router.get("/:id", getUangMakanById);
export default router;
