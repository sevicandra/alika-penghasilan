import { Router } from "express";
import z from "zod";
import { detailPenghasilan } from "@/controllers/v1/penghasilan.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { validateQuery } from "@/middlewares/validate-request.middleware";

const router = Router();
const querySchema = z.object({
  tahun: z
    .string("tahun is required")
    .trim()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]"),
});
router.get(
  "/Detail",
  authorizeScopes(["penghasilan.penghasilan.read"]),
  validateQuery(querySchema),
  detailPenghasilan
);
export default router;
