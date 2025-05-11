import { Router } from "express";
import {
  getAllDataTte,
  getDataTteById,
  countAllDataTte,
  tolakDataTte
} from "@/controllers/v2/dataTte.controller";

const router = Router();
router.get("/", getAllDataTte);
router.get("/Count", countAllDataTte);
router.get("/:id", getDataTteById);
router.post("/:id", tolakDataTte);
export default router;
