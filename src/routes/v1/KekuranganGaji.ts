import { Router } from "express";
import {
  getAllKekuranganGaji,
  countAllKekuranganGaji,
  getKekuranganGajiById,
  createKekuranganGaji,
  importCsvKekuranganGaji,
  updateKekuranganGaji,
  hapusKekuranganGaji,
  getTahunKekuranganGaji,
  getBulanKekuranganGaji,
} from "@/controllers/v1/kekuranganGaji.controller";
import multer from "multer";
const router = Router();
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

router.get("/", getAllKekuranganGaji);
router.get("/Count", countAllKekuranganGaji);
router.get("/GetTahun", getTahunKekuranganGaji);
router.get("/Tahun/:tahun/GetBulan", getBulanKekuranganGaji);
router.get("/:id", getKekuranganGajiById);
router.post("/", createKekuranganGaji);
router.post("/ImportCsv", upload.single("file"), importCsvKekuranganGaji);
router.patch("/:id", updateKekuranganGaji);
router.delete("/:id", hapusKekuranganGaji);

export default router;
