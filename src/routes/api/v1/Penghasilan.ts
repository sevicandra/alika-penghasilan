import { Router } from "express";
import { detailPenghasilan } from "@/controllers/v1/penghasilan.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get(
  "/Detail",
  authenticate(["penghasilan.penghasilan.read"]),
  detailPenghasilan
);
export default router;
