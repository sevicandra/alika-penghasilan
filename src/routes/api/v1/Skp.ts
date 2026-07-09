import { Router } from "express";
import z from "zod";
import { SkpControllerV1 } from "@/controllers/v1/skp.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { validateBody } from "@/middlewares/validate-request.middleware";

const router = Router();
const bodySchema = z.object({
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
});

router.post(
  "/Preview",
  authorizeScopes(["penghasilan.skp.print"]),
  validateBody(bodySchema),
  SkpControllerV1.preview
);
router.post(
  "/Cetak",
  authorizeScopes(["penghasilan.skp.submit"]),
  validateBody(bodySchema),
  SkpControllerV1.cetak
);
export default router;
