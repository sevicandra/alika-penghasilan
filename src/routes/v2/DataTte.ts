import { Router } from "express";
import {
  getAllDataTte,
  getDataTteById,
  countAllDataTte,
  tolakDataTte
} from "@/controllers/v2/dataTte.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(["penghasilan2.datatte.read"]),getAllDataTte);
router.get("/Count", authenticate(["penghasilan2.datatte.read"]),countAllDataTte);
router.get("/:id", authenticate(["penghasilan2.datatte.read"]),getDataTteById);
router.post("/:id/tolak", authenticate(["penghasilan2.datatte.reject"]),tolakDataTte);
export default router;
