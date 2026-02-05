import { Router } from "express";
import z from "zod";
import { RefSptTahunanControllerV1 } from "@/controllers/v1/refSptTahunan.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middlewares/validate-request.middleware";

const router = Router();

const createSchema = z.object({
  tahun: z
    .string()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]")
    .optional(),
  ptkp_wp: z.number().nonnegative().default(0),
  ptkp_istri: z.number().nonnegative().default(0),
  ptkp_anak: z.number().nonnegative().default(0),
  iuran_pensiun: z.number().nonnegative().default(0),
  biaya_jabatan: z.number().nonnegative().default(0),
  biaya_jabatan_maks: z.number().nonnegative().default(0),
  pph_tarif_1: z.number().nonnegative().default(0),
  pph_tarif_2: z.number().nonnegative().default(0),
  pph_tarif_3: z.number().nonnegative().default(0),
  pph_tarif_4: z.number().nonnegative().default(0),
  pph_limit_1: z.number().nonnegative().default(0),
  pph_limit_2: z.number().nonnegative().default(0),
  pph_limit_3: z.number().nonnegative().default(0),
});

const updateSchema = createSchema.partial();

const querySchema = z.object({
  limit: z.string().regex(/^\d+$/, "invalid format limit [0-9]").optional(),
  offset: z.string().regex(/^\d+$/, "invalid format offset [0-9]").optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "invalid format sort")
    .optional(),
});

router.get(
  "/",
  authorizeScopes(["penghasilan.refspt.read"]),
  validateQuery(querySchema),
  RefSptTahunanControllerV1.getAll
);
router.get(
  "/Count",
  authorizeScopes(["penghasilan.refspt.read"]),
  validateQuery(querySchema),
  RefSptTahunanControllerV1.count
);
router.get(
  "/tahun/:tahun",
  authorizeScopes(["penghasilan.refspt.read"]),
  validateParams(z.object({ tahun: z.string().regex(/^\d{4}$/, "invalid format tahun [YYYY]") })),
  RefSptTahunanControllerV1.getByTahun
);
router.get("/:id", authorizeScopes(["penghasilan.refspt.read"]), RefSptTahunanControllerV1.getById);
router.post(
  "/",
  authorizeScopes(["penghasilan.refspt.write"]),
  validateBody(createSchema),
  RefSptTahunanControllerV1.create
);
router.patch(
  "/:id",
  authorizeScopes(["penghasilan.refspt.update"]),
  validateBody(updateSchema),
  RefSptTahunanControllerV1.update
);
router.delete(
  "/:id",
  authorizeScopes(["penghasilan.refspt.delete"]),
  RefSptTahunanControllerV1.delete
);
export default router;
