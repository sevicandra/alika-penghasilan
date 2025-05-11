import { Router } from "express";
import {
    getAllUangLembur,
    countAllUangLembur,
    getTahunUangLembur,
    getBulanUangLembur,
    getUangLemburById,
    createUangLembur,
    importCsvUangLembur,
    updateUangLembur,
    hapusUangLembur,
} from "@/controllers/v1/uangLembur.controller"
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
router.get("/", getAllUangLembur);
router.get("/Count", countAllUangLembur);
router.get("/GetTahun", getTahunUangLembur);
router.get("/Tahun/:tahun/GetBulan", getBulanUangLembur);
router.get("/:id", getUangLemburById);
router.post("/", createUangLembur);
router.post("/ImportCsv", upload.single("file"), importCsvUangLembur);
router.put("/:id", updateUangLembur);
router.delete("/:id", hapusUangLembur);
export default router;