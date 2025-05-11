import { Router } from "express";
import {
  getAllDataNomor,
  countAllDataNomor,
  getDataNomorById,
  createDataNomor,
  updateDataNomor,
  hapusDataNomor,
} from "@/controllers/v1/dataNomor.controller";

const router = Router();

router.get("/", getAllDataNomor);
router.get("/Count", countAllDataNomor);
router.get("/:id", getDataNomorById);
router.post("/", createDataNomor);
router.patch("/:id", updateDataNomor);
router.delete("/:id", hapusDataNomor);
export default router;
