import { Router } from "express";
import {
  getAllRefPangkat,
  countAllRefPangkat,
  getRefPangkatById,
  createRefPangkat,
  updateRefPangkat,
  hapusRefPangkat,
} from "@/controllers/v1/refPangkat.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get(
  "/",
  authenticate(["penghasilan.refpangkat.read"]),
  getAllRefPangkat
);
router.get(
  "/Count",
  authenticate(["penghasilan.refpangkat.read"]),
  countAllRefPangkat
);
router.get(
  "/:id",
  authenticate(["penghasilan.refpangkat.read"]),
  getRefPangkatById
);
router.post(
  "/",
  authenticate(["penghasilan.refpangkat.write"]),
  createRefPangkat
);
router.patch(
  "/:id",
  authenticate(["penghasilan.refpangkat.update"]),
  updateRefPangkat
);
router.delete(
  "/:id",
  authenticate(["penghasilan.refpangkat.delete"]),
  hapusRefPangkat
);
export default router;
