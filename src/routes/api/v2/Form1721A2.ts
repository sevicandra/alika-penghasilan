import { Router } from "express";
import z from "zod";
import { SPTControllerV2 } from "@/controllers/v2/form1721A2.controller";
import { validateBody } from "@/middlewares/validate-request.middleware";

const bodySchema = z.object({
  tahun: z
    .string("tahun is required")
    .trim()
    .regex(/^\d{4}$/, "invalid format tahun [YYYY]"),
});
const router = Router();
router.post("/Preview", validateBody(bodySchema), SPTControllerV2.preview);
router.post("/Cetak", validateBody(bodySchema), SPTControllerV2.cetak);
export default router;
