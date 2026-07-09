import { Router } from "express";
import z from "zod";
import { DaftarGajiControllerV2 } from "@/controllers/v2/daftarGaji.controller";
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
});
router.post("/Preview", validateBody(bodySchema), DaftarGajiControllerV2.preview);
router.post("/Cetak", validateBody(bodySchema), DaftarGajiControllerV2.cetak);

export default router;
