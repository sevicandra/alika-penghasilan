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
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get(
  "/",
  authenticate(["penghasilan.refspt.read"]),
  getAllRefSptTahunan
);
router.get(
  "/Count",
  authenticate(["penghasilan.refspt.read"]),
  countAllRefSptTahunan
);
router.get(
  "/tahun/:tahun",
  authenticate(["penghasilan.refspt.read"]),
  getRefSptTahunanByTahun
);
router.get(
  "/:id",
  authenticate(["penghasilan.refspt.read"]),
  getRefSptTahunanById
);
router.post(
  "/",
  authenticate(["penghasilan.refspt.write"]),
  createRefSptTahunan
);
router.patch(
  "/:id",
  authenticate(["penghasilan.refspt.update"]),
  updateRefSptTahunan
);
router.delete(
  "/:id",
  authenticate(["penghasilan.refspt.delete"]),
  deleteRefSptTahunan
);
export default router;
