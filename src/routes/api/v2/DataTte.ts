import { Router } from "express";
import z from "zod";
import { DataTteControllerV2 } from "@/controllers/v2/dataTte.controller";
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
router.get("/", validateQuery(querySchema), DataTteControllerV2.getAll);
router.get("/Count", validateQuery(querySchema), DataTteControllerV2.count);
router.get("/:id", DataTteControllerV2.getById);
router.post("/:id/tolak", DataTteControllerV2.tolak);
export default router;
