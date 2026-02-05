import { Router } from "express";
import z from "zod";
import { DataNomorControllerV1 } from "@/controllers/v1/dataNomor.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { validateBody, validateQuery } from "@/middlewares/validate-request.middleware";

const router = Router();

const createSchema = z.object({
  kdsatker: z
    .string("kdsatker is required")
    .trim()
    .regex(/^\d{6}$/, "invalid format kdsatker [000000-999999]"),
  tahun: z
    .string("tahun is required")
    .trim()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]"),
  no_urut_skp: z
    .string("no urut skp is required")
    .trim()
    .regex(/^\d+$/, "invalid format no urut skp [0-9]"),
  ext_skp: z.string("extensi skp is required").trim().min(1, "extensi skp is required"),
  no_urut_kp4: z
    .string("no urut kp4 is required")
    .trim()
    .regex(/^\d+$/, "invalid format no urut skp [0-9]"),
  ext_kp4: z.string("extensi kp4 is required").trim().min(1, "extensi kp4 is required"),
  no_urut_daftar: z
    .string("no urut daftar is required")
    .trim()
    .regex(/^\d+$/, "invalid format no urut skp [0-9]"),
  ext_daftar: z.string("extensi daftar is required").trim().min(1, "extensi daftar is required"),
  no_urut_pph: z
    .string("no urut pph is required")
    .trim()
    .regex(/^\d+$/, "invalid format no urut skp [0-9]"),
  ext_pph: z.string("extensi pph is required").trim().min(1, "extensi pph is required"),
  no_urut_final: z
    .string("no urut pph final is required")
    .trim()
    .regex(/^\d+$/, "invalid format no urut skp [0-9]"),
  ext_final: z
    .string("extensi pph final is required")
    .trim()
    .min(1, "extensi pph final is required"),
});

const updateSchema = createSchema.partial();

const querySchema = z.object({
  limit: z.string().regex(/^\d+$/, "invalid format limit [0-9]").optional(),
  offset: z.string().regex(/^\d+$/, "invalid format offset [0-9]").optional(),
  kdsatker: z
    .string()
    .regex(/^\d{6}$/, "invalid format kdsatker [000000-999999]")
    .optional(),
  tahun: z
    .string()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]")
    .optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "Format sort tidak valid")
    .optional(),
});

router.get(
  "/",
  authorizeScopes(["penghasilan.nomor.read"]),
  validateQuery(querySchema),
  DataNomorControllerV1.getAll
);
router.get(
  "/Count",
  authorizeScopes(["penghasilan.nomor.read"]),
  validateQuery(querySchema),
  DataNomorControllerV1.count
);
router.get("/:id", authorizeScopes(["penghasilan.nomor.read"]), DataNomorControllerV1.getById);
router.post(
  "/",
  authorizeScopes(["penghasilan.nomor.write"]),
  validateBody(createSchema),
  DataNomorControllerV1.create
);
router.patch(
  "/:id",
  authorizeScopes(["penghasilan.nomor.update"]),
  validateBody(updateSchema),
  DataNomorControllerV1.update
);
router.delete("/:id", authorizeScopes(["penghasilan.nomor.delete"]), DataNomorControllerV1.delete);
export default router;
