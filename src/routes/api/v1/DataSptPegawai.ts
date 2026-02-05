import { Router } from "express";
import z from "zod";
import { DataSptPegawaiControllerV1 } from "@/controllers/v1/dataSptPegawai.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { uploadCsvMemory } from "@/middlewares/multer.middleware";
import {
  validateBody,
  validateCsvMiddleware,
  validateQuery,
} from "@/middlewares/validate-request.middleware";

const createSchema = z.object({
  kdsatker: z
    .string("kdsatker is required")
    .trim()
    .regex(/^\d{6}$/, "invalid format kdsatker [000000-999999]"),
  tahun: z
    .string("tahun is required")
    .trim()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]"),
  nip: z
    .string("nip is required")
    .trim()
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2])([1-2])(\d{3})$/,
      "Invalid nip format [18 digits without separator]"
    ),
  npwp: z
    .string("npwp is required")
    .trim()
    .regex(/^\d{16}$/, "invalid format npwp [16 digits]"),
  kdgol: z
    .string("kdgol is required")
    .trim()
    .regex(/^\d{2}$/, "invalid format kdgol [00-99]"),
  alamat: z.string("alamat is required").trim().min(1, "alamat is required"),
  kdkawin: z
    .string("kdkawin is required")
    .trim()
    .regex(/^[1]{1}[0-1]{1}[0]{1}[0-3]{1}$/, "invalid format kdkawin"),
  kdjab: z
    .string("kdjab is required")
    .trim()
    .regex(/^\d{5}$/, "invalid format kdjab [00000-99999]"),
  nourut: z.number("nourut is required").optional(),
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
  nip: z
    .string("nip is required")
    .trim()
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2])([1-2])(\d{3})$/,
      "Invalid nip format [18 digits without separator]"
    )
    .optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "Format sort tidak valid")
    .optional(),
});

const router = Router();
router.get(
  "/",
  authorizeScopes(["penghasilan.spt.read"]),
  validateQuery(querySchema),
  DataSptPegawaiControllerV1.getAll
);
router.get(
  "/Count",
  authorizeScopes(["penghasilan.spt.read"]),
  validateQuery(querySchema),
  DataSptPegawaiControllerV1.count
);
router.get(
  "/GetTahun",
  authorizeScopes(["penghasilan.spt.read"]),
  validateQuery(querySchema),
  DataSptPegawaiControllerV1.getTahun
);
router.get("/:id", authorizeScopes(["penghasilan.spt.read"]), DataSptPegawaiControllerV1.getById);
router.post(
  "/",
  authorizeScopes(["penghasilan.spt.write"]),
  validateBody(createSchema),
  DataSptPegawaiControllerV1.create
);
router.patch(
  "/:id",
  authorizeScopes(["penghasilan.spt.update"]),
  validateBody(updateSchema),
  DataSptPegawaiControllerV1.update
);
router.delete(
  "/:id",
  authorizeScopes(["penghasilan.spt.delete"]),
  DataSptPegawaiControllerV1.delete
);
router.post(
  "/ImportCsv",
  authorizeScopes(["penghasilan.gaji.import"]),
  uploadCsvMemory,
  validateCsvMiddleware(createSchema),
  DataSptPegawaiControllerV1.import
);

export default router;
