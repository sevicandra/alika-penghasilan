import { Router } from "express";
import z from "zod";
import { filePreview } from "@/controllers/v1/filePreview.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { validateQuery } from "@/middlewares/validate-request.middleware";

const router = Router();

const querySchema = z.object({
  nip: z
    .string("nip is required")
    .trim()
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2]|2[1-9]|3[0-2])([1-2])(\d{3})$/,
      "Invalid nip format [18 digits without separator]"
    ),
});

router.get(
  "/:id",
  authorizeScopes(["penghasilan.file.access"]),
  validateQuery(querySchema),
  filePreview
);

export default router;
