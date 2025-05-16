import { Router } from "express";
import {
    processTte,
    processTteKp4s
} from "@/controllers/v2/tte.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.post("/", authenticate(["penghasilan2.tte.process"]),processTte);
router.post("/Kp4s", authenticate(["penghasilan2.tte.process"]),processTteKp4s);
export default router;