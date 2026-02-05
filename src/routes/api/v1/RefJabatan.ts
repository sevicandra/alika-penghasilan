import { Router } from "express";
import z from "zod";
import { RefJabatanControllerV1 } from "@/controllers/v1/refJabatan.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { validateBody, validateQuery } from "@/middlewares/validate-request.middleware";

const router = Router();

const createSchema = z.object({
  kode: z
    .string("kode is required")
    .trim()
    .regex(/^\d{5}$/, "invalid format kode [00000-99999]"),
  nama: z.string("nama is required").trim().min(1, "nama is required"),
});

const updateSchema = createSchema.partial();

const querySchema = z.object({
  limit: z.string().regex(/^\d+$/, "invalid format limit [0-9]").optional(),
  offset: z.string().regex(/^\d+$/, "invalid format offset [0-9]").optional(),
  kode: z
    .string("kode is required")
    .trim()
    .regex(/^\d{5}$/, "invalid format kode [00000-99999]")
    .optional(),
  nama: z.string("nama is required").trim().min(1, "nama is required").optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "invalid format sort")
    .optional(),
});

router.get(
  "/",
  authorizeScopes(["penghasilan.refjabatan.read"]),
  validateQuery(querySchema),
  RefJabatanControllerV1.getAll
);
router.get(
  "/Count",
  authorizeScopes(["penghasilan.refjabatan.read"]),
  validateQuery(querySchema),
  RefJabatanControllerV1.count
);
router.get(
  "/:id",
  authorizeScopes(["penghasilan.refjabatan.read"]),
  RefJabatanControllerV1.getById
);
router.post(
  "/",
  authorizeScopes(["penghasilan.refjabatan.write"]),
  validateBody(updateSchema),
  RefJabatanControllerV1.create
);
router.patch(
  "/:id",
  authorizeScopes(["penghasilan.refjabatan.update"]),
  validateBody(createSchema),
  RefJabatanControllerV1.update
);
router.delete(
  "/:id",
  authorizeScopes(["penghasilan.refjabatan.delete"]),
  RefJabatanControllerV1.delete
);
export default router;
