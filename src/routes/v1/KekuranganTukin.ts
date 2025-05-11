import { Router } from "express";
import {
  getAllKekuranganTukin,
  countAllKekuranganTukin,
  getTahunKekuranganTukin,
  getBulanKekuranganTukin,
  getKekuranganTukinById,
  createKekuranganTukin,
  importCsvKekuranganTukin,
  updateKekuranganTukin,
  hapusKekuranganTukin,
} from "@/controllers/v1/kekuranganTukin.controller";
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

router.get("/", getAllKekuranganTukin);
router.get("/Count", countAllKekuranganTukin);
router.get("/GetTahun", getTahunKekuranganTukin);
router.get("/Tahun/:tahun/GetBulan", getBulanKekuranganTukin);
router.get("/:id", getKekuranganTukinById);
router.post("/", createKekuranganTukin);
router.post("/ImportCsv", upload.single("file"), importCsvKekuranganTukin);
router.patch("/:id", updateKekuranganTukin);
router.delete("/:id", hapusKekuranganTukin);

export default router;
