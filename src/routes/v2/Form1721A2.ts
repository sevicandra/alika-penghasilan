import { Router } from "express";
import {
  previewForm1721A2,
  cetakForm1721A2,
} from "@/controllers/v2/form1721A2.controller";

const router = Router();
router.post("/Preview", previewForm1721A2);
router.post("/Cetak", cetakForm1721A2);
export default router;