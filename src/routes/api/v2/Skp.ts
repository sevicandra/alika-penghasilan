import { Router } from "express";
import z from "zod";
import { SkpControllerV2 } from "@/controllers/v2/skp.controller";
import { validateBody } from "@/middlewares/validate-request.middleware";

const router = Router();

const bodySchema = z.object({
  bulan: z
    .string("bulan is required")
    .trim()
    .regex(/^(0[1-9]{1}|1[0-2]{1})$/, "invalid format bulan [01-12]"),
  tahun: z
    .string("tahun is required")
    .trim()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]"),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "Format sort tidak valid")
    .optional(),
});

router.post("/Preview", validateBody(bodySchema), SkpControllerV2.preview);
router.post("/Cetak", validateBody(bodySchema), SkpControllerV2.cetak);
export default router;
