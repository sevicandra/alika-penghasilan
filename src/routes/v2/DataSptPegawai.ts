import { Router } from "express";
import { getTahunDataSptPegawai } from "@/controllers/v2/dataSptPegawai.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/GetTahun", authenticate(), getTahunDataSptPegawai);
export default router;
