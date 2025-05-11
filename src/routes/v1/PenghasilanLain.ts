import { Router } from "express";
import {
  getAllPenghasilanLain,
  countAllPenghasilanLain,
  getTahunPenghasilanLain,
  getBulanPenghasilanLain,
  getJenisPenghasilanLain,
  getPenghasilanLainById,
  createPenghasilanLain,
  importCsvPenghasilanLain,
  updatePenghasilanLain,
  hapusPenghasilanLain,
} from "@/controllers/v1/penghasilanLain.controller";
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

router.get("/", getAllPenghasilanLain);
router.get("/Count", countAllPenghasilanLain);
router.get("/GetTahun", getTahunPenghasilanLain);
router.get("/Tahun/:tahun/GetBulan", getBulanPenghasilanLain);
router.get("/GetJenis", getJenisPenghasilanLain);
router.get("/:id", getPenghasilanLainById);
router.post("/", createPenghasilanLain);
router.post("/ImportCsv", upload.single("file"), importCsvPenghasilanLain);
router.patch("/:id", updatePenghasilanLain);
router.delete("/:id", hapusPenghasilanLain);

export default router;
