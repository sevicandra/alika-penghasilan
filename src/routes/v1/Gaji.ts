import { Router } from "express";
import {
  getAllGaji,
  countAllGaji,
  getTahunGaji,
  getBulanGaji,
  getGajiById,
  createGaji,
  importCsvGaji,
  updateGaji,
  hapusGaji,
} from "@/controllers/v1/gaji.controller";
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

router.get("/", getAllGaji);
router.get("/Count", countAllGaji);
router.get("/GetTahun", getTahunGaji);
router.get("/Tahun/:tahun/GetBulan", getBulanGaji);
router.get("/:id", getGajiById);
router.post("/", createGaji);
router.post("/ImportCsv", upload.single("file"), importCsvGaji);
router.patch("/:id", updateGaji);
router.delete("/:id", hapusGaji);

export default router;
