import { Router } from "express";
import {
  previewForm1721VII,
  cetakForm1721VII,
} from "@/controllers/v2/form1721VII.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.post("/Preview", authenticate(), previewForm1721VII);
router.post("/Cetak", authenticate(), cetakForm1721VII);
export default router;
