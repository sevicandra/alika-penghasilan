import { Router } from "express";
import {
  getAllTukin,
  countAllTukin,
  getTahunTukin,
  getBulanTukin,
  getTukinById,
  createTukin,
  importCsvTukin,
  updateTukin,
  hapusTukin,
} from "@/controllers/v1/tukin.controller";
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

router.get("/", getAllTukin);
router.get("/Count", countAllTukin);
router.get("/GetTahun", getTahunTukin);
router.get("/Tahun/:tahun/GetBulan", getBulanTukin);
router.get("/:id", getTukinById);
router.post("/", createTukin);
router.post("/ImportCsv", upload.single("file"), importCsvTukin);
router.patch("/:id", updateTukin);
router.delete("/:id", hapusTukin);

export default router;