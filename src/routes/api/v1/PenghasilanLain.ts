import { Router } from "express";
import z from "zod";
import { PenghasilanLainControllerV1 } from "@/controllers/v1/penghasilanLain.controller";
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
  bruto: z.number("gapok is required").nonnegative(),
  pph: z.number("gapok is required").nonnegative(),
  netto: z.number("gapok is required").nonnegative(),
  jenis: z.string("jenis is required"),
  uraian: z.string("uraian is required"),
  tanggal: z.number("tanggal is required"),
  nospm: z.string().optional(),
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
      )
      .optional(),
    jenis: z.string().optional(),
    kdsatker: z
      .string()
      .regex(/^\d{6}$/, "invalid format kdsatker [000000-999999]")
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
  authorizeScopes(["penghasilan.penghasilanlain.read"]),
  validateQuery(querySchema),
  PenghasilanLainControllerV1.getAll
);
router.get(
  "/Count",
  authorizeScopes(["penghasilan.penghasilanlain.read"]),
  PenghasilanLainControllerV1.count
);
router.get(
  "/GetTahun",
  authorizeScopes(["penghasilan.penghasilanlain.read"]),
  validateQuery(querySchema),
  PenghasilanLainControllerV1.getTahun
);
router.get(
  "/Tahun/:tahun/GetBulan",
  authorizeScopes(["penghasilan.penghasilanlain.read"]),
  validateParams(z.object({ tahun: z.string().regex(/^\d{4}$/, "invalid format tahun [YYYY]") })),
  validateQuery(querySchema),
  PenghasilanLainControllerV1.getBulan
);
router.get(
  "/GetJenis",
  authorizeScopes(["penghasilan.penghasilanlain.read"]),
  validateQuery(querySchema),
  PenghasilanLainControllerV1.getJenis
);
router.get(
  "/:id",
  authorizeScopes(["penghasilan.penghasilanlain.read"]),
  PenghasilanLainControllerV1.getById
);
router.post(
  "/",
  authorizeScopes(["penghasilan.penghasilanlain.write"]),
  validateBody(createSchema),
  PenghasilanLainControllerV1.create
);
router.post(
  "/ImportCsv",
  authorizeScopes(["penghasilan.penghasilanlain.import"]),
  uploadCsvMemory,
  validateCsvMiddleware(createSchema),
  PenghasilanLainControllerV1.import
);
router.patch(
  "/:id",
  authorizeScopes(["penghasilan.penghasilanlain.update"]),
  validateBody(updateSchema),
  PenghasilanLainControllerV1.update
);
router.delete(
  "/:id",
  authorizeScopes(["penghasilan.penghasilanlain.delete"]),
  PenghasilanLainControllerV1.delete
);

export default router;
