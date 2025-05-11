import { Router } from "express";
import {
  getAllRefJabatan,
  countAllRefJabatan,
  getRefJabatanById,
  createRefJabatan,
  updateRefJabatan,
  hapusRefJabatan,
} from "@/controllers/v1/refJabatan.controller";

const router = Router();
router.get("/", getAllRefJabatan);
router.get("/Count", countAllRefJabatan);
router.get("/:id", getRefJabatanById);
router.post("/", createRefJabatan);
router.put("/:id", updateRefJabatan);
router.delete("/:id", hapusRefJabatan);
export default router;
