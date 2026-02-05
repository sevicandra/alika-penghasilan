import { Router } from "express";
import z from "zod";
import { RefPangkatControllerV1 } from "@/controllers/v1/refPangkat.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { validateBody, validateQuery } from "@/middlewares/validate-request.middleware";

const router = Router();

const createSchema = z.object({
  kode: z
    .string("kode is required")
    .trim()
    .regex(/^\d{2}$/, "invalid format kode [00-99]"),
  nama: z.string("nama is required").trim().min(1, "nama is required"),
});

const updateSchema = createSchema.partial();

const querySchema = z.object({
  limit: z.string().regex(/^\d+$/, "invalid format limit [0-9]").optional(),
  offset: z.string().regex(/^\d+$/, "invalid format offset [0-9]").optional(),
  kode: z
    .string("kode is required")
    .trim()
    .regex(/^\d{2}$/, "invalid format kode [00-99]")
    .optional(),
  nama: z.string("nama is required").trim().min(1, "nama is required").optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "invalid format sort")
    .optional(),
});

router.get(
  "/",
  authorizeScopes(["penghasilan.refpangkat.read"]),
  validateQuery(querySchema),
  RefPangkatControllerV1.getAll
);
router.get(
  "/Count",
  authorizeScopes(["penghasilan.refpangkat.read"]),
  validateQuery(querySchema),
  RefPangkatControllerV1.count
);
router.get(
  "/:id",
  authorizeScopes(["penghasilan.refpangkat.read"]),
  RefPangkatControllerV1.getById
);
router.post(
  "/",
  authorizeScopes(["penghasilan.refpangkat.write"]),
  validateBody(createSchema),
  RefPangkatControllerV1.create
);
router.patch(
  "/:id",
  authorizeScopes(["penghasilan.refpangkat.update"]),
  validateBody(updateSchema),
  RefPangkatControllerV1.update
);
router.delete(
  "/:id",
  authorizeScopes(["penghasilan.refpangkat.delete"]),
  RefPangkatControllerV1.delete
);
export default router;
