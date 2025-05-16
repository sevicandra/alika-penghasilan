import { Router } from "express";
import {
  getAllRefJabatan,
  countAllRefJabatan,
  getRefJabatanById,
  createRefJabatan,
  updateRefJabatan,
  hapusRefJabatan,
} from "@/controllers/v1/refJabatan.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get(
  "/",
  authenticate(["penghasilan.refjabatan.read"]),
  getAllRefJabatan
);
router.get(
  "/Count",
  authenticate(["penghasilan.refjabatan.read"]),
  countAllRefJabatan
);
router.get(
  "/:id",
  authenticate(["penghasilan.refjabatan.read"]),
  getRefJabatanById
);
router.post(
  "/",
  authenticate(["penghasilan.refjabatan.write"]),
  createRefJabatan
);
router.patch(
  "/:id",
  authenticate(["penghasilan.refjabatan.update"]),
  updateRefJabatan
);
router.delete(
  "/:id",
  authenticate(["penghasilan.refjabatan.delete"]),
  hapusRefJabatan
);
export default router;
