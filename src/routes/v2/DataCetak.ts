import { Router } from "express";
import {
  getAllDataCetak,
  getDataCetakById,
  countAllDataCetak,
  hapusDataCetak
} from "@/controllers/v2/dataCetak.controller";

const router = Router();
router.get("/", getAllDataCetak);
router.get("/Count", countAllDataCetak);
router.get("/:id", getDataCetakById);
router.delete("/:id", hapusDataCetak);
export default router;
