import { Router } from "express";
import {
  getAllDataSptPegawai,
  getDataSptPegawaiById,
  createDataSptPegawai,
  updateDataSptPegawai,
  countAllDataSptPegawai,
  getTahunDataSptPegawai,
  hapusDataSptPegawai,
} from "@/controllers/v1/dataSptPegawai.controller";
const router = Router();

router.get("/", getAllDataSptPegawai);
router.get("/Count", countAllDataSptPegawai);
router.get("/GetTahun", getTahunDataSptPegawai);
router.get("/:id", getDataSptPegawaiById);
router.post("/", createDataSptPegawai);
router.patch("/:id", updateDataSptPegawai);
router.delete("/:id", hapusDataSptPegawai);

export default router;