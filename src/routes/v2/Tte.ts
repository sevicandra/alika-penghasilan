import { Router } from "express";
import {
    processTte,
    processTteKp4s
} from "@/controllers/v2/tte.controller";

const router = Router();
router.post("/", processTte);
router.post("/Kp4s", processTteKp4s);
export default router;