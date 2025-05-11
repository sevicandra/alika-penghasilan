import { Router } from "express";
import {
  getAllRefSatker,
  countAllRefSatker,
  getRefSatkerById,
  createRefSatker,
  updateRefSatker,
  hapusRefSatker,
} from "@/controllers/v1/refSatker.controller";

const router = Router();
router.get("/", getAllRefSatker);
router.get("/Count", countAllRefSatker);
router.get("/:id", getRefSatkerById);
router.post("/", createRefSatker);
router.put("/:id", updateRefSatker);
router.delete("/:id", hapusRefSatker);
export default router;
