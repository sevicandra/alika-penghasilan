import { Router } from "express";
import {
  previewForm1721A2,
  cetakForm1721A2,
} from "@/controllers/v2/form1721A2.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.post("/Preview", authenticate(), previewForm1721A2);
router.post("/Cetak", authenticate(), cetakForm1721A2);
export default router;
