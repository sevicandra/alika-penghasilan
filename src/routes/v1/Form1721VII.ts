import { Router } from "express";
import {
  previewForm1721VII,
  cetakForm1721VII,
} from "@/controllers/v1/form1721VII.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.post(
  "/Preview",
  authenticate(["penghasilan.1721vii.print"]),
  previewForm1721VII
);
router.post(
  "/Cetak",
  authenticate(["penghasilan.1721vii.submit"]),
  cetakForm1721VII
);
export default router;
