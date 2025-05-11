import { Router } from "express";
import {
  previewForm1721VII,
  cetakForm1721VII,
} from "@/controllers/v1/form1721VII.controller";

const router = Router();
router.post("/Preview", previewForm1721VII);
router.post("/Cetak", cetakForm1721VII);
export default router;