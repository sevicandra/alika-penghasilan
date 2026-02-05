import { Router } from "express";
import z from "zod";
import { DataCetakControllerV2 } from "@/controllers/v2/dataCetak.controller";
import { validateQuery } from "@/middlewares/validate-request.middleware";

const router = Router();

const querySchema = z.object({
  limit: z.string().regex(/^\d+$/, "invalid format limit [0-9]").optional(),
  offset: z.string().regex(/^\d+$/, "invalid format offset [0-9]").optional(),
  tahun: z
    .string("tahun is required")
    .trim()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]")
    .optional(),
  jenis: z.string("jenis is required").trim().optional(),
  status: z.string("status is required").trim().optional(),
  hal: z.string("hal is required").optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "Format sort tidak valid")
    .optional(),
});

router.get("/", validateQuery(querySchema), DataCetakControllerV2.getAll);
router.get("/Count", validateQuery(querySchema), DataCetakControllerV2.count);
router.get("/:id", DataCetakControllerV2.getById);
router.delete("/:id", DataCetakControllerV2.delete);
export default router;
