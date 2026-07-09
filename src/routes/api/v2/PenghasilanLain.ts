import { Router } from "express";
import z from "zod";
import { PenghasilanLainControllerV2 } from "@/controllers/v2/penghasilanLain.controller";
import { validateParams, validateQuery } from "@/middlewares/validate-request.middleware";

const router = Router();

const querySchema = z
  .object({
    limit: z.string().regex(/^\d+$/, "invalid format limit [0-9]").optional(),
    offset: z.string().regex(/^\d+$/, "invalid format offset [0-9]").optional(),
    tahun: z
      .string("tahun is required")
      .trim()
      .regex(/^\d{4}$/, "invalid format tahun [YYYY]")
      .optional(),
    bulan: z
      .string("bulan is required")
      .trim()
      .regex(/^(0[1-9]{1}|1[0-4]{1})$/, "invalid format bulan [01-14]")
      .optional(),
    jenis: z.string("jenis is required").trim().optional(),
    sort: z
      .string()
      .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "Format sort tidak valid")
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
router.get("/", validateQuery(querySchema), PenghasilanLainControllerV2.getAll);
router.get("/Count", validateQuery(querySchema), PenghasilanLainControllerV2.count);
router.get("/GetTahun", PenghasilanLainControllerV2.getTahun);
router.get(
  "/Tahun/:tahun/GetBulan",
  validateParams(z.object({ tahun: z.string().regex(/^\d{4}$/, "invalid format tahun [YYYY]") })),
  PenghasilanLainControllerV2.getBulan
);
router.get("/GetJenis", validateQuery(querySchema), PenghasilanLainControllerV2.getJenis);
router.get("/GetRekap", validateQuery(querySchema), PenghasilanLainControllerV2.getRekap);
router.get("/:id", PenghasilanLainControllerV2.getById);
export default router;
