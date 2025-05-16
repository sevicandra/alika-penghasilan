import { Router } from "express";
import {
  getAllTukin,
  getBulanTukin,
  getTukinById,
  getRekapKekuranganTukin,
  getTahunTukin,
  countAllTukin,
} from "@/controllers/v2/tukin.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(["penghasilan2.tukin.read"]),getAllTukin);
router.get("/Count", authenticate(["penghasilan2.tukin.read"]),countAllTukin);
router.get("/GetTahun", authenticate(["penghasilan2.tukin.read"]),getTahunTukin);
router.get("/Tahun/:tahun/GetBulan", authenticate(["penghasilan2.tukin.read"]),getBulanTukin);
router.get("/GetRekap", authenticate(["penghasilan2.tukin.read"]),getRekapKekuranganTukin);
router.get("/:id", authenticate(["penghasilan2.tukin.read"]),getTukinById);
export default router;
