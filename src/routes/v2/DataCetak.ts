import { Router } from "express";
import {
  getAllDataCetak,
  getDataCetakById,
  countAllDataCetak,
  hapusDataCetak,
} from "@/controllers/v2/dataCetak.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(["penghasilan2.datacetak.read"]), getAllDataCetak);
router.get(
  "/Count",
  authenticate(["penghasilan2.datacetak.read"]),
  countAllDataCetak
);
router.get(
  "/:id",
  authenticate(["penghasilan2.datacetak.read"]),
  getDataCetakById
);
router.delete(
  "/:id",
  authenticate(["penghasilan2.datacetak.delete"]),
  hapusDataCetak
);
export default router;
