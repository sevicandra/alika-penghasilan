import { Router } from "express";
import {
  getAllRefSptTahunan,
  countAllRefSptTahunan,
  getRefSptTahunanById,
  getRefSptTahunanByTahun,
  createRefSptTahunan,
  updateRefSptTahunan,
  deleteRefSptTahunan,
} from "@/controllers/v1/refSptTahunan.controller";

const router = Router();
router.get("/", getAllRefSptTahunan);
router.get("/Count", countAllRefSptTahunan);
router.get("/tahun/:tahun", getRefSptTahunanByTahun);
router.get("/:id", getRefSptTahunanById);
router.post("/", createRefSptTahunan);
router.put("/:id", updateRefSptTahunan);
router.delete("/:id", deleteRefSptTahunan);
export default router;
