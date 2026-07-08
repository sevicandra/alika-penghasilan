import { Router } from "express";
import z from "zod";
import { Kp4ControllerV1 } from "@/controllers/v1/kp4.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { validateBody } from "@/middlewares/validate-request.middleware";

const router = Router();

const bodySchema = z.object({
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
  "/Cetak",
  authorizeScopes(["penghasilan.kp4.submit"]),
  validateBody(bodySchema),
  Kp4ControllerV1.cetak
);
router.post(
  "/Preview",
  authorizeScopes(["penghasilan.kp4.print"]),
  validateBody(bodySchema),
  Kp4ControllerV1.preview
);
export default router;
