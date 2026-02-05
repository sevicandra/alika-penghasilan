import { Router } from "express";
import { DataSptPegawaiControllerV2 } from "@/controllers/v2/dataSptPegawai.controller";

const router = Router();
router.get("/GetTahun", DataSptPegawaiControllerV2.getTahun);
export default router;
