import { Router } from "express";
import z from "zod";
import { SPTFinalControllerV2 } from "@/controllers/v2/form1721VII.controller";
import { validateBody } from "@/middlewares/validate-request.middleware";

const bodySchema = z.object({
  tahun: z
    .string("tahun is required")
    .trim()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]"),
});
const router = Router();
router.post("/Preview", validateBody(bodySchema), SPTFinalControllerV2.preview);
router.post("/Cetak", validateBody(bodySchema), SPTFinalControllerV2.cetak);
export default router;
