import { Router } from "express";
import z from "zod";
import { RefSatkerControllerV1 } from "@/controllers/v1/refSatker.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middlewares/validate-request.middleware";

const router = Router();

const createSchema = z.object({
  kdsatker: z
    .string("kode satker is required")
    .regex(/^\d{6}$/, "invalid format kdsatker [000000-999999]"),
  nmsatker: z.string("nama satker is required").trim().min(1, "nama satker is required"),
  header1: z.string("header1 is required").trim().min(1, "header1 is required"),
  header2: z.string("header2 is required").trim().optional().nullable(),
  subheader1: z.string("subheader1 is required").trim().min(1, "subheader1 is required"),
  subheader2: z.string("subheader2 is required").trim().optional().nullable(),
  subheader3: z.string("subheader3 is required").trim().optional().nullable(),
  kota: z.string("kota is required").trim().min(1, "kota is required"),
});

const updateSchema = createSchema.partial();

const querySchema = z.object({
  limit: z.string().regex(/^\d+$/, "invalid format limit [0-9]").optional(),
  offset: z.string().regex(/^\d+$/, "invalid format offset [0-9]").optional(),
  keyword: z.string().optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "invalid format sort")
    .optional(),
});

router.get(
  "/",
  authorizeScopes(["penghasilan.refsatker.read"]),
  validateQuery(querySchema),
  RefSatkerControllerV1.getAll
);
router.get(
  "/Count",
  authorizeScopes(["penghasilan.refsatker.read"]),
  validateQuery(querySchema),
  RefSatkerControllerV1.count
);
router.get(
  "/KdSatker/:kdSatker",
  authorizeScopes(["penghasilan.refsatker.read"]),
  validateParams(
    z.object({ kdSatker: z.string().regex(/^\d{6}$/, "invalid format tahun [000000-999999]") })
  ),
  RefSatkerControllerV1.getByKodeSatker
);
router.get("/:id", authorizeScopes(["penghasilan.refsatker.read"]), RefSatkerControllerV1.getById);
router.post(
  "/",
  authorizeScopes(["penghasilan.refsatker.write"]),
  validateBody(createSchema),
  RefSatkerControllerV1.create
);
router.patch(
  "/:id",
  authorizeScopes(["penghasilan.refsatker.update"]),
  validateBody(updateSchema),
  RefSatkerControllerV1.update
);
router.delete(
  "/:id",
  authorizeScopes(["penghasilan.refsatker.delete"]),
  RefSatkerControllerV1.delete
);
export default router;
