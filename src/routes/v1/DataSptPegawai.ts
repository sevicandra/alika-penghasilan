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
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(["penghasilan.spt.read"]), getAllDataSptPegawai);
router.get(
  "/Count",
  authenticate(["penghasilan.spt.read"]),
  countAllDataSptPegawai
);
router.get(
  "/GetTahun",
  authenticate(["penghasilan.spt.read"]),
  getTahunDataSptPegawai
);
router.get(
  "/:id",
  authenticate(["penghasilan.spt.read"]),
  getDataSptPegawaiById
);
router.post("/", authenticate(["penghasilan.spt.write"]), createDataSptPegawai);
router.patch(
  "/:id",
  authenticate(["penghasilan.spt.update"]),
  updateDataSptPegawai
);
router.delete(
  "/:id",
  authenticate(["penghasilan.spt.delete"]),
  hapusDataSptPegawai
);

export default router;
