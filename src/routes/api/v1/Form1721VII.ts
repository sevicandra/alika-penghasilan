import { Router } from "express";
import z from "zod";
import { SPTFinalControllerV1 } from "@/controllers/v1/form1721VII.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { validateBody } from "@/middlewares/validate-request.middleware";

const bodySchema = z.object({
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
});

const router = Router();

router.post(
  "/Preview",
  authorizeScopes(["penghasilan.1721vii.print"]),
  validateBody(bodySchema),
  SPTFinalControllerV1.preview
);
router.post(
  "/Cetak",
  authorizeScopes(["penghasilan.1721vii.submit"]),
  validateBody(bodySchema),
  SPTFinalControllerV1.cetak
);
export default router;
