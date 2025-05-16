import { Router } from "express";
import { detailPenghasilan } from "@/controllers/v2/penghasilan.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/Detail", authenticate(["penghasilan2.penghasilan.read"]),detailPenghasilan);
export default router;
