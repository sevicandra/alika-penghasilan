import { Router } from "express";
import {
  previewForm1721A2,
  cetakForm1721A2,
} from "@/controllers/v2/form1721A2.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.post("/Preview", authenticate(["penghasilan2.1721a2.print"]),previewForm1721A2);
router.post("/Cetak", authenticate(["penghasilan2.1721a2.submit"]),cetakForm1721A2);
export default router;