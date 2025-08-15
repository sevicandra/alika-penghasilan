import { Router } from "express";
import {
  getAllDataCetak,
  getDataCetakById,
  countAllDataCetak,
  hapusDataCetak,
} from "@/controllers/v2/dataCetak.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(), getAllDataCetak);
router.get("/Count", authenticate(), countAllDataCetak);
router.get("/:id", authenticate(), getDataCetakById);
router.delete("/:id", authenticate(), hapusDataCetak);
export default router;
