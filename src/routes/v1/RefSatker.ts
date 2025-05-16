import { Router } from "express";
import {
  getAllRefSatker,
  countAllRefSatker,
  getRefSatkerById,
  createRefSatker,
  updateRefSatker,
  hapusRefSatker,
} from "@/controllers/v1/refSatker.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(["penghasilan.refsatker.read"]), getAllRefSatker);
router.get(
  "/Count",
  authenticate(["penghasilan.refsatker.read"]),
  countAllRefSatker
);
router.get(
  "/:id",
  authenticate(["penghasilan.refsatker.read"]),
  getRefSatkerById
);
router.post(
  "/",
  authenticate(["penghasilan.refsatker.write"]),
  createRefSatker
);
router.patch(
  "/:id",
  authenticate(["penghasilan.refsatker.update"]),
  updateRefSatker
);
router.delete(
  "/:id",
  authenticate(["penghasilan.refsatker.delete"]),
  hapusRefSatker
);
export default router;
