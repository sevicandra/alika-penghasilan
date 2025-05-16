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
router.get("/", authenticate(["penghasilan2.lembur.read"]),getAllUangLembur);
router.get("/Count", authenticate(["penghasilan2.lembur.read"]),countAllUangLembur);
router.get("/GetTahun", authenticate(["penghasilan2.lembur.read"]),getTahunUangLembur);
router.get("/Tahun/:tahun/GetBulan", authenticate(["penghasilan2.lembur.read"]),getBulanUangLembur);
router.get("/GetRekap", authenticate(["penghasilan2.lembur.read"]),getRekapUangLembur);
router.get("/:id", authenticate(["penghasilan2.lembur.read"]),getUangLemburById);
export default router;
