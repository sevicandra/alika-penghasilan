import { Router } from "express";
import z from "zod";
import { UangLemburControllerV1 } from "@/controllers/v1/uangLembur.controller";
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
    .regex(/^\[a-zA-Z0-9]{2}$/, "invalid format kdanak [00-99]")
    .optional(),
  gol: z
    .string("gol is required")
    .trim()
    .regex(/^[1-4]{1}$/, "invalid format gol [1-4]")
    .optional(),
  jkerja: z.number("gapok is required").nonnegative().default(0),
  jlibur: z.number("gapok is required").nonnegative().default(0),
  jmakan: z.number("gapok is required").nonnegative().default(0),
  lembur: z.number("gapok is required").nonnegative().default(0),
  makan: z.number("gapok is required").nonnegative().default(0),
  pph: z.number("gapok is required").nonnegative().default(0),
  bruto: z.number("gapok is required").nonnegative().default(0),
  netto: z.number("gapok is required").nonnegative().default(0),
  keterangan: z.string("gapok is required").optional(),
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
  authorizeScopes(["penghasilan.lembur.read"]),
  validateQuery(querySchema),
  UangLemburControllerV1.getAll
);
router.get(
  "/Count",
  authorizeScopes(["penghasilan.lembur.read"]),
  validateQuery(querySchema),
  UangLemburControllerV1.count
);
router.get(
  "/GetTahun",
  authorizeScopes(["penghasilan.lembur.read"]),
  validateQuery(querySchema),
  UangLemburControllerV1.getTahun
);
router.get(
  "/Tahun/:tahun/GetBulan",
  authorizeScopes(["penghasilan.lembur.read"]),
  validateParams(z.object({ tahun: z.string().regex(/^\d{4}$/, "invalid format tahun [YYYY]") })),
  validateQuery(querySchema),
  UangLemburControllerV1.getBulan
);
router.get("/:id", authorizeScopes(["penghasilan.lembur.read"]), UangLemburControllerV1.getById);
router.post(
  "/",
  authorizeScopes(["penghasilan.lembur.write"]),
  validateBody(createSchema),
  UangLemburControllerV1.create
);
router.post(
  "/ImportCsv",
  authorizeScopes(["penghasilan.lembur.import"]),
  uploadCsvMemory,
  validateCsvMiddleware(createSchema),
  UangLemburControllerV1.import
);
router.patch(
  "/:id",
  authorizeScopes(["penghasilan.lembur.update"]),
  validateBody(updateSchema),
  UangLemburControllerV1.update
);
router.delete(
  "/:id",
  authorizeScopes(["penghasilan.lembur.delete"]),
  UangLemburControllerV1.delete
);
export default router;
