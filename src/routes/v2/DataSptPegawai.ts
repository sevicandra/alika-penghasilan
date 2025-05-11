import { Router } from "express";
import { getTahunDataSptPegawai } from "@/controllers/v2/dataSptPegawai.controller";

const router = Router();
router.get("/GetTahun", getTahunDataSptPegawai);
export default router;
