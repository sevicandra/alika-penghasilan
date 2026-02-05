import { Router } from "express";
import z from "zod";
import { detailPenghasilan } from "@/controllers/v2/penghasilan.controller";
import { validateQuery } from "@/middlewares/validate-request.middleware";

const router = Router();
const querySchema = z.object({
  tahun: z
    .string("tahun is required")
    .trim()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]"),
});
router.get("/Detail", validateQuery(querySchema), detailPenghasilan);
export default router;
