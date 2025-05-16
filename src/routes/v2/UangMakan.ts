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
router.get("/", authenticate(["penghasilan2.makan.read"]),getAllUangMakan);
router.get("/Count", authenticate(["penghasilan2.makan.read"]),countAllUangMakan);
router.get("/GetTahun", authenticate(["penghasilan2.makan.read"]),getTahunUangMakan);
router.get("/Tahun/:tahun/GetBulan", authenticate(["penghasilan2.makan.read"]),getBulanUangMakan);
router.get("/GetRekap", authenticate(["penghasilan2.makan.read"]),getRekapUangMakan);
router.get("/:id", authenticate(["penghasilan2.makan.read"]),getUangMakanById);
export default router;
