import { Router } from "express";
import z from "zod";
import { UangLemburControllerV2 } from "@/controllers/v2/uangLembur.controller";
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

router.get("/", validateQuery(querySchema), UangLemburControllerV2.getAll);
router.get("/Count", validateQuery(querySchema), UangLemburControllerV2.count);
router.get("/GetTahun", UangLemburControllerV2.getTahun);
router.get(
  "/Tahun/:tahun/GetBulan",
  validateParams(z.object({ tahun: z.string().regex(/^\d{4}$/, "invalid format tahun [YYYY]") })),
  UangLemburControllerV2.getBulan
);
router.get("/GetRekap", validateQuery(querySchema), UangLemburControllerV2.getRekap);
router.get("/:id", UangLemburControllerV2.getById);
export default router;
