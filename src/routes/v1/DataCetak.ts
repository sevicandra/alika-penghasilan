import { Router } from "express";
import {
  getAllDataCetak,
  countAllDataCetak,
  getDataCetakById,
  updateDataCetak,
  hapusDataCetak,
} from "@/controllers/v1/dataCetak.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(["penghasilan.datacetak.read"]), getAllDataCetak);
router.get(
  "/Count",
  authenticate(["penghasilan.datacetak.read"]),
  countAllDataCetak
);
router.get(
  "/:id",
  authenticate(["penghasilan.datacetak.read"]),
  getDataCetakById
);
router.patch(
  "/:id",
  authenticate(["penghasilan.datacetak.update"]),
  updateDataCetak
);
router.delete(
  "/:id",
  authenticate(["penghasilan.datacetak.delete"]),
  hapusDataCetak
);
export default router;
