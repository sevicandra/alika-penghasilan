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
router.get("/", authenticate(["penghasilan2.gaji.read"]),getAllGaji);
router.get("/Count", authenticate(["penghasilan2.gaji.read"]),countAllGaji);
router.get("/GetTahun", authenticate(["penghasilan2.gaji.read"]),getTahunGaji);
router.get("/Tahun/:tahun/GetBulan", authenticate(["penghasilan2.gaji.read"]),getBulanGaji);
router.get("/GetRekap", authenticate(["penghasilan2.gaji.read"]),getRekapGaji);
router.get("/:id", authenticate(["penghasilan2.gaji.read"]),getGajiById);
export default router;
