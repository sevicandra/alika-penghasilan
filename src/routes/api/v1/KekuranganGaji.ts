import { Router } from "express";
import z from "zod";
import { DataKurangControllerV1 } from "@/controllers/v1/kekuranganGaji.controller";
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
  kdjns: z
    .string("kode jenis is required")
    .trim()
    .regex(/^d{1}$/, "invalid format kode jenis [d]"),
  kdsatker: z
    .string("kode satker is required")
    .regex(/^\d{6}$/, "invalid format kdsatker [000000-999999]"),
  kdanak: z
    .string("kode anak is required")
    .trim()
    .regex(/^\[a-zA-Z0-9]{2}$/, "invalid format kdanak [00-99]"),
  kdsubanak: z
    .string()
    .trim()
    .regex(/^\d{2}$/, "invalid format kdsubanak [00-99]")
    .optional(),
  kdkawin: z
    .string("kdkawin is required")
    .trim()
    .regex(/^[1]{1}[0-1]{1}[0]{1}[0-3]{1}$/, "invalid format kdkawin"),
  kdgapok: z
    .string("kdgapok is required")
    .trim()
    .regex(/^([1-3]{1}[A-D]{1}|[4]{1}[A-E]{1})[0-9]{2}$/, "invalid format kdgapok [0000-9999]"),
  kdjab: z
    .string("kdjab is required")
    .trim()
    .regex(/^\d{5}$/, "invalid format kdjab [00000-99999]"),
  bulan: z
    .string("bulan is required")
    .trim()
    .regex(/^(0[1-9]{1}|1[0-4]{1})$/, "invalid format bulan [01-14]"),
  tahun: z
    .string("tahun is required")
    .trim()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]"),
  nip: z
    .string("nip is required")
    .trim()
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2]|2[1-9]|3[0-2])([1-2])(\d{3})$/,
      "Invalid nip format [18 digits without separator]"
    ),
  gapok: z.coerce.number("gapok is required").nonnegative().default(0),
  tistri: z.coerce.number("gapok is required").nonnegative().default(0),
  tanak: z.coerce.number("gapok is required").nonnegative().default(0),
  tumum: z.coerce.number("gapok is required").nonnegative().default(0),
  ttambumum: z.coerce.number("gapok is required").nonnegative().default(0),
  tstruktur: z.coerce.number("gapok is required").nonnegative().default(0),
  tfungsi: z.coerce.number("gapok is required").nonnegative().default(0),
  bulat: z.coerce.number("gapok is required").nonnegative().default(0),
  tberas: z.coerce.number("gapok is required").nonnegative().default(0),
  tpajak: z.coerce.number("gapok is required").nonnegative().default(0),
  pberas: z.coerce.number("gapok is required").nonnegative().default(0),
  tpapua: z.coerce.number("gapok is required").nonnegative().default(0),
  tpencil: z.coerce.number("gapok is required").nonnegative().default(0),
  tlain: z.coerce.number("gapok is required").nonnegative().default(0),
  iwp: z.coerce.number("gapok is required").nonnegative().default(0),
  pph: z.coerce.number("gapok is required").nonnegative().default(0),
  sewarmh: z.coerce.number("gapok is required").nonnegative().default(0),
  tunggakan: z.coerce.number("gapok is required").nonnegative().default(0),
  utanglebih: z.coerce.number("gapok is required").nonnegative().default(0),
  potlain: z.coerce.number("gapok is required").nonnegative().default(0),
  taperum: z.coerce.number("gapok is required").nonnegative().default(0),
  bpjs: z.coerce.number("gapok is required").nonnegative().default(0),
  bpjs2: z.coerce.number("gapok is required").nonnegative().default(0),
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
      .regex(/^(0[1-9]{1}|1[0-4]{1})$/, "invalid format bulan [01-14]")
      .optional(),
    kdanak: z
      .string("kode anak is required")
      .trim()
      .regex(/^\[a-zA-Z0-9]{2}$/, "invalid format kdanak [00-99]")
      .optional(),
    nip: z
      .string("nip is required")
      .trim()
      .regex(
        /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2]|2[1-9]|3[0-2])([1-2])(\d{3})$/,
        "Invalid nip format [18 digits without separator]"
      )
      .optional(),
    kdgapok: z
      .string("kdgapok is required")
      .trim()
      .regex(/^([1-3]{1}[A-D]{1}|[4]{1}[A-E]{1})[0-9]{2}$/, "invalid format kdgapok [0000-9999]")
      .optional(),
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
  authorizeScopes(["penghasilan.gaji.read"]),
  validateQuery(querySchema),
  DataKurangControllerV1.getAll
);
router.get(
  "/Count",
  authorizeScopes(["penghasilan.gaji.read"]),
  validateQuery(querySchema),
  DataKurangControllerV1.count
);
router.get(
  "/GetTahun",
  authorizeScopes(["penghasilan.gaji.read"]),
  validateQuery(querySchema),
  DataKurangControllerV1.getTahun
);
router.get(
  "/Tahun/:tahun/GetBulan",
  authorizeScopes(["penghasilan.gaji.read"]),
  validateParams(z.object({ tahun: z.string().regex(/^\d{4}$/, "invalid format tahun [YYYY]") })),
  validateQuery(querySchema),
  DataKurangControllerV1.getBulan
);
router.get("/:id", authorizeScopes(["penghasilan.gaji.read"]), DataKurangControllerV1.getById);
router.post(
  "/",
  authorizeScopes(["penghasilan.gaji.write"]),
  validateBody(createSchema),
  DataKurangControllerV1.create
);
router.post(
  "/ImportCsv",
  authorizeScopes(["penghasilan.gaji.import"]),
  uploadCsvMemory,
  validateCsvMiddleware(createSchema),
  DataKurangControllerV1.import
);
router.patch(
  "/:id",
  authorizeScopes(["penghasilan.gaji.update"]),
  validateBody(updateSchema),
  DataKurangControllerV1.update
);
router.delete("/:id", authorizeScopes(["penghasilan.gaji.delete"]), DataKurangControllerV1.delete);

export default router;
