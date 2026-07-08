import { Router } from "express";
import z from "zod";
import { DataPenandatanganControllerV1 } from "@/controllers/v1/profil.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { validateBody, validateQuery } from "@/middlewares/validate-request.middleware";

const router = Router();

const createSchema = z.object({
  tahun: z
    .string("tahun is required")
    .trim()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]"),
  kdsatker: z
    .string("kode satker is required")
    .regex(/^\d{6}$/, "invalid format kdsatker [000000-999999]"),
  nama_ttd_skp: z.string("nama ttd skp is required").trim().min(1, "nama ttd skp is required"),
  nip_ttd_skp: z
    .string("nip ttd skp is required")
    .trim()
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2]|2[1-9]|3[0-2])([1-2])(\d{3})$/,
      "Invalid nip format [18 digits without separator]"
    ),
  jab_ttd_skp: z.string("jabatan ttd skp is required").trim().min(1, "jabatan ttd skp is required"),
  nama_ttd_kp4: z.string("nama ttd kp4 is required").trim().min(1, "nama ttd kp4 is required"),
  nip_ttd_kp4: z
    .string("nip is required")
    .trim()
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2]|2[1-9]|3[0-2])([1-2])(\d{3})$/,
      "Invalid nip format [18 digits without separator]"
    ),
  jab_ttd_kp4: z.string("jabatan ttd kp4 is required").trim().min(1, "jabatan ttd kp4 is required"),
  npwp_bendahara: z
    .string("npwp bendahara is required")
    .trim()
    .regex(/^\d{16}$/, "invalid format npwp [16 digits]"),
  nama_bendahara: z
    .string("nama bendahara is required")
    .trim()
    .min(1, "nama bendahara is required"),
  nip_bendahara: z
    .string("nip is required")
    .trim()
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2]|2[1-9]|3[0-2])([1-2])(\d{3})$/,
      "Invalid nip format [18 digits without separator]"
    ),
  tgl_spt: z.string("tanggal spt is required").trim().min(1, "tanggal spt is required"),
});

const updateSchema = createSchema.partial();

const querySchema = z.object({
  limit: z.string().regex(/^\d+$/, "invalid format limit [0-9]").optional(),
  offset: z.string().regex(/^\d+$/, "invalid format offset [0-9]").optional(),
  tahun: z
    .string()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]")
    .optional(),
  kdsatker: z
    .string()
    .regex(/^\d{6}$/, "invalid format kdsatker [000000-999999]")
    .optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "invalid format sort")
    .optional(),
});

router.get(
  "/",
  authorizeScopes(["penghasilan.profil.read"]),
  validateQuery(querySchema),
  DataPenandatanganControllerV1.getAll
);
router.get(
  "/Count",
  authorizeScopes(["penghasilan.profil.read"]),
  validateQuery(querySchema),
  DataPenandatanganControllerV1.count
);
router.get(
  "/:id",
  authorizeScopes(["penghasilan.profil.read"]),
  DataPenandatanganControllerV1.getById
);
router.post(
  "/",
  authorizeScopes(["penghasilan.profil.write"]),
  validateBody(createSchema),
  DataPenandatanganControllerV1.create
);
router.patch(
  "/:id",
  authorizeScopes(["penghasilan.profil.update"]),
  validateBody(updateSchema),
  DataPenandatanganControllerV1.update
);
router.delete(
  "/:id",
  authorizeScopes(["penghasilan.profil.delete"]),
  DataPenandatanganControllerV1.delete
);
export default router;
