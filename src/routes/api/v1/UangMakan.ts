import { Router } from "express";
import z from "zod";
import { UangMakanControllerV1 } from "@/controllers/v1/uangMakan.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { uploadCsvMemory } from "@/middlewares/multer.middleware";
import {
  validateBody,
  validateCsvMiddleware,
  validateParams,
  validateQuery,
} from "@/middlewares/validate-request.middleware";

const router = Router();

const createSchema = z.object({
  bulan: z
    .string("bulan is required")
    .trim()
    .regex(/^(0[1-9]{1}|1[0-2]{1})$/, "invalid format bulan [01-12]"),
  tahun: z
    .string("tahun is required")
    .trim()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]"),
  kdsatker: z
    .string("kode satker is required")
    .regex(/^\d{6}$/, "invalid format kdsatker [000000-999999]"),
  nip: z
    .string("nip is required")
    .trim()
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2])([1-2])(\d{3})$/,
      "Invalid nip format [18 digits without separator]"
    ),
  kdanak: z
    .string("kode anak is required")
    .trim()
    .regex(/^\[a-zA-Z0-9]{2}$/, "invalid format kdanak [00-99]"),
  kdsubanak: z
    .string("kode anak is required")
    .trim()
    .regex(/^\[a-zA-Z0-9]{2}$/, "invalid format kdanak [00-99]")
    .optional(),
  kdgol: z
    .string("gol is required")
    .trim()
    .regex(/^[1-4]{1}$/, "invalid format gol [1-4]"),
  jmlhari: z.number("gapok is required").nonnegative().default(0),
  tarif: z.number("gapok is required").nonnegative().default(0),
  pph: z.number("gapok is required").nonnegative().default(0),
  bruto: z.number("gapok is required").nonnegative().default(0),
  netto: z.number("gapok is required").nonnegative().default(0),
});

const updateSchema = createSchema.partial();

const querySchema = z
  .object({
    limit: z.string().regex(/^\d+$/, "invalid format limit [0-9]").optional(),
    offset: z.string().regex(/^\d+$/, "invalid format offset [0-9]").optional(),
    tahun: z
      .string()
      .regex(/^\d{4}$/, "invalid format tahun [YYYY]")
      .optional(),
    bulan: z
      .string("bulan is required")
      .trim()
      .regex(/^(0[1-9]{1}|1[0-2]{1})$/, "invalid format bulan [01-12]")
      .optional(),
    nip: z
      .string("nip is required")
      .trim()
      .regex(
        /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2])([1-2])(\d{3})$/,
        "Invalid nip format [18 digits without separator]"
      ),
    sort: z
      .string()
      .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "invalid format sort")
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.bulan) {
      if (!val.tahun) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "tahun is required when bulan is provided",
          path: ["tahun"],
        });
      }
    }
  });

router.get(
  "/",
  authorizeScopes(["penghasilan.makan.read"]),
  validateQuery(querySchema),
  UangMakanControllerV1.getAll
);
router.get(
  "/Count",
  authorizeScopes(["penghasilan.makan.read"]),
  validateQuery(querySchema),
  UangMakanControllerV1.count
);
router.get(
  "/GetTahun",
  authorizeScopes(["penghasilan.makan.read"]),
  validateQuery(querySchema),
  UangMakanControllerV1.getTahun
);
router.get(
  "/Tahun/:tahun/GetBulan",
  authorizeScopes(["penghasilan.makan.read"]),
  validateParams(z.object({ tahun: z.string().regex(/^\d{4}$/, "invalid format tahun [YYYY]") })),
  validateQuery(querySchema),
  UangMakanControllerV1.getBulan
);
router.get("/:id", authorizeScopes(["penghasilan.makan.read"]), UangMakanControllerV1.getById);
router.post(
  "/",
  authorizeScopes(["penghasilan.makan.write"]),
  validateBody(createSchema),
  UangMakanControllerV1.create
);
router.post(
  "/ImportCsv",
  authorizeScopes(["penghasilan.makan.import"]),
  uploadCsvMemory,
  validateCsvMiddleware(createSchema),
  UangMakanControllerV1.import
);
router.patch(
  "/:id",
  authorizeScopes(["penghasilan.makan.update"]),
  validateBody(updateSchema),
  UangMakanControllerV1.update
);
router.delete("/:id", authorizeScopes(["penghasilan.makan.delete"]), UangMakanControllerV1.delete);
export default router;
