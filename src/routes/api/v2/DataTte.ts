import { Router } from "express";
import {
  getAllDataTte,
  getDataTteById,
  countAllDataTte,
  tolakDataTte,
} from "@/controllers/v2/dataTte.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(), getAllDataTte);
router.get("/Count", authenticate(), countAllDataTte);
router.get("/:id", authenticate(), getDataTteById);
router.post("/:id/tolak", authenticate(), tolakDataTte);
export default router;
