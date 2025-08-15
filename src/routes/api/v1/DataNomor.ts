import { Router } from "express";
import {
  getAllDataNomor,
  countAllDataNomor,
  getDataNomorById,
  createDataNomor,
  updateDataNomor,
  hapusDataNomor,
} from "@/controllers/v1/dataNomor.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate(["penghasilan.nomor.read"]), getAllDataNomor);
router.get(
  "/Count",
  authenticate(["penghasilan.nomor.read"]),
  countAllDataNomor
);
router.get(
  "/:id",
  authenticate(["penghasilan.nomor.read"]),
  getDataNomorById
);
router.post(
  "/",
  authenticate(["penghasilan.nomor.write"]),
  createDataNomor
);
router.patch(
  "/:id",
  authenticate(["penghasilan.nomor.update"]),
  updateDataNomor
);
router.delete(
  "/:id",
  authenticate(["penghasilan.nomor.delete"]),
  hapusDataNomor
);
export default router;
