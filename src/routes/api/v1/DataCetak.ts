import { Router } from "express";
import z from "zod";
import { DataCetakControllerV1 } from "@/controllers/v1/dataCetak.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { uploadPdfDisk, uploadPdfDiskOptional } from "@/middlewares/multer.middleware";
import { validateBodyWithFile, validateQuery } from "@/middlewares/validate-request.middleware";

const createSchema = z.object({
  tahun: z
    .string("tahun is required")
    .trim()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]"),
  nip_asal: z
    .string("nip asal is required")
    .trim()
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2])([1-2])(\d{3})$/,
      "Invalid nip asal format [18 digits without separator]"
    ),
  nip_tujuan: z
    .string("nip tujuan is required")
    .trim()
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2])([1-2])(\d{3})$/,
      "Invalid nip asal format [18 digits without separator]"
    ),
  nama_tujuan: z
    .string("nama tujuan is required")
    .min(3, "nama tujuan is too short")
    .max(100, "nama tujuan is too long"),
  jenis: z.string("jenis is required").trim().min(1, "jenis is required"),
  nomor: z.string("nomor is required").min(1, "nomor is required"),
  tanggal: z.string("tanggal is required").trim().min(1, "tanggal is required"),
  tujuan: z.string("tujuan is required").trim().min(1, "tujuan is required"),
  perihal: z.string("perihal is required").trim().min(1, "perihal is required"),
  file: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.enum(["application/pdf"], "Format file tidak didukung. Harap upload PDF."),
    size: z.number().max(50 * 1024 * 1024, {
      message: `Ukuran file maksimal adalah 50MB.`,
    }),
  }),
  date: z.string().optional(),
  id_dokumen: z.string().optional(),
  status: z.string().optional(),
});

const updateSchema = createSchema.partial();

const querySchema = z.object({
  limit: z.string().regex(/^\d+$/, "invalid format limit [0-9]").optional(),
  offset: z.string().regex(/^\d+$/, "invalid format offset [0-9]").optional(),
  nip_asal: z
    .string("nip asal is required")
    .trim()
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2])([1-2])(\d{3})$/,
      "Invalid nip asal format [18 digits without separator]"
    )
    .optional(),
  nip_tujuan: z
    .string("nip tujuan is required")
    .trim()
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2])([1-2])(\d{3})$/,
      "Invalid nip asal format [18 digits without separator]"
    )
    .optional(),
  tahun: z
    .string("tahun is required")
    .trim()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]")
    .optional(),
  jenis: z.string("jenis is required").trim().optional(),
  status: z.string("status is required").trim().optional(),
  hal: z.string("hal is required").optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "Format sort tidak valid")
    .optional(),
});

const router = Router();
router.get(
  "/",
  authorizeScopes(["penghasilan.datacetak.read"]),
  validateQuery(querySchema),
  DataCetakControllerV1.getAll
);
router.get(
  "/Count",
  authorizeScopes(["penghasilan.datacetak.read"]),
  validateQuery(querySchema),
  DataCetakControllerV1.count
);
router.get("/:id", authorizeScopes(["penghasilan.datacetak.read"]), DataCetakControllerV1.getById);
router.post(
  "/",
  authorizeScopes(["penghasilan.datacetak.write"]),
  uploadPdfDisk,
  validateBodyWithFile(createSchema),
  DataCetakControllerV1.create
);
router.patch(
  "/:id",
  authorizeScopes(["penghasilan.datacetak.update"]),
  uploadPdfDiskOptional,
  validateBodyWithFile(updateSchema),
  DataCetakControllerV1.update
);
router.delete(
  "/:id",
  authorizeScopes(["penghasilan.datacetak.delete"]),
  DataCetakControllerV1.delete
);
export default router;
