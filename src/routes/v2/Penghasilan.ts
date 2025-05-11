import { Router } from "express";
import { detailPenghasilan } from "@/controllers/v2/penghasilan.controller";

const router = Router();
router.get("/Detail", detailPenghasilan);
export default router;
