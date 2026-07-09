import { Router } from "express";
import z from "zod";
import { DataKekuranganTukinControllerV1 } from "@/controllers/v1/kekuranganTukin.controller";
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
    .regex(/^(0[1-9]{1}|1[0-4]{1})$/, "invalid format bulan [01-14]"),
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
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2]|2[1-9]|3[0-2])([1-2])(\d{3})$/,
      "Invalid nip format [18 digits without separator]"
    ),
  grade: z
    .string("grade is required")
    .trim()
    .regex(/^\d{2}$/, "invalid format grade [00-99]"),
  tjpokok: z.coerce.number("tunjangan pokok is required").nonnegative().default(0),
  tjtamb: z.coerce.number("tunjangan tambahan is required").nonnegative().default(0),
  abspotr: z.coerce.number("absen potongan is required").default(0),
  abspotp: z.coerce.number("absen potongan (%) is required").default(0),
  tkpph: z.coerce.number("tunjangan PPh is required").nonnegative().default(0),
  potpph: z.coerce.number("potongan PPh is required").nonnegative().default(0),
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
    nip: z
      .string("nip is required")
      .trim()
      .regex(
        /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2]|2[1-9]|3[0-2])([1-2])(\d{3})$/,
        "Invalid nip format [18 digits without separator]"
      )
      .optional(),
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
  authorizeScopes(["penghasilan.tukin.read"]),
  validateQuery(querySchema),
  DataKekuranganTukinControllerV1.getAll
);
router.get(
  "/Count",
  authorizeScopes(["penghasilan.tukin.read"]),
  validateQuery(querySchema),
  DataKekuranganTukinControllerV1.count
);
router.get(
  "/GetTahun",
  authorizeScopes(["penghasilan.tukin.read"]),
  validateQuery(querySchema),
  DataKekuranganTukinControllerV1.getTahun
);
router.get(
  "/Tahun/:tahun/GetBulan",
  authorizeScopes(["penghasilan.tukin.read"]),
  validateParams(z.object({ tahun: z.string().regex(/^\d{4}$/, "invalid format tahun [YYYY]") })),
  validateQuery(querySchema),
  DataKekuranganTukinControllerV1.getBulan
);
router.get(
  "/:id",
  authorizeScopes(["penghasilan.tukin.read"]),
  DataKekuranganTukinControllerV1.getById
);
router.post(
  "/",
  authorizeScopes(["penghasilan.tukin.write"]),
  validateBody(createSchema),
  DataKekuranganTukinControllerV1.create
);
router.post(
  "/ImportCsv",
  authorizeScopes(["penghasilan.tukin.import"]),
  uploadCsvMemory,
  validateCsvMiddleware(createSchema),
  DataKekuranganTukinControllerV1.import
);
router.patch(
  "/:id",
  authorizeScopes(["penghasilan.tukin.update"]),
  validateBody(updateSchema),
  DataKekuranganTukinControllerV1.update
);
router.delete(
  "/:id",
  authorizeScopes(["penghasilan.tukin.delete"]),
  DataKekuranganTukinControllerV1.delete
);

export default router;
