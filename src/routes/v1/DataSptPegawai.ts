import { Router } from "express";
import {
  getAllDataSptPegawai,
  getDataSptPegawaiById,
  createDataSptPegawai,
  updateDataSptPegawai,
  countAllDataSptPegawai,
  getTahunDataSptPegawai,
  hapusDataSptPegawai,
  importCsvDataSpt
} from "@/controllers/v1/dataSptPegawai.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // maksimal 5MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.endsWith(".csv")) {
      return cb(new Error("Only CSV files are allowed"));
    }
    cb(null, true);
  },
});
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
router.post(
  "/ImportCsv",
  authenticate(["penghasilan.gaji.import"]),
  upload.single("file"),
  importCsvDataSpt
);

export default router;
