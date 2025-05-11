import { Router } from "express";
import {
  getAllDataCetak,
  countAllDataCetak,
  getDataCetakById,
  updateDataCetak,
  hapusDataCetak,
} from "@/controllers/v1/dataCetak.controller";

const router = Router();
router.get("/", getAllDataCetak);
router.get("/Count", countAllDataCetak);
router.get("/:id", getDataCetakById);
router.patch("/:id", updateDataCetak);
router.delete("/:id", hapusDataCetak);
export default router;
