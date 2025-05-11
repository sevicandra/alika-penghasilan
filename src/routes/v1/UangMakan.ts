import { Router } from "express";
import {
  getAllUangMakan,
  countAllUangMakan,
  getTahunUangMakan,
  getBulanUangMakan,
  getUangMakanById,
  createUangMakan,
  importCsvUangMakan,
  updateUangMakan,
  hapusUangMakan,
} from "@/controllers/v1/uangMakan.controller";
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
router.get("/", getAllUangMakan);
router.get("/Count", countAllUangMakan);
router.get("/GetTahun", getTahunUangMakan);
router.get("/Tahun/:tahun/GetBulan", getBulanUangMakan);
router.get("/:id", getUangMakanById);
router.post("/", createUangMakan);
router.post("/ImportCsv", upload.single("file"), importCsvUangMakan);
router.put("/:id", updateUangMakan);
router.delete("/:id", hapusUangMakan);
export default router;
