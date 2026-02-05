import { Router } from "express";
import { Kp4ControllerV2 } from "@/controllers/v2/kp4.controller";

const router = Router();

router.post("/Cetak", Kp4ControllerV2.cetak);
router.post("/Preview", Kp4ControllerV2.preview);
export default router;
