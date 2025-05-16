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
} from "@/controllers/v1/uangLembur.controller";
import multer from "multer";
import { authenticate } from "@/middlewares/auth.middleware";
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
router.get("/", authenticate(["penghasilan.lembur.read"]), getAllUangLembur);
router.get(
  "/Count",
  authenticate(["penghasilan.lembur.read"]),
  countAllUangLembur
);
router.get(
  "/GetTahun",
  authenticate(["penghasilan.lembur.read"]),
  getTahunUangLembur
);
router.get(
  "/Tahun/:tahun/GetBulan",
  authenticate(["penghasilan.lembur.read"]),
  getBulanUangLembur
);
router.get(
  "/:id",
  authenticate(["penghasilan.lembur.read"]),
  getUangLemburById
);
router.post("/", authenticate(["penghasilan.lembur.write"]), createUangLembur);
router.post(
  "/ImportCsv",
  authenticate(["penghasilan.lembur.import"]),
  upload.single("file"),
  importCsvUangLembur
);
router.patch(
  "/:id",
  authenticate(["penghasilan.lembur.update"]),
  updateUangLembur
);
router.delete(
  "/:id",
  authenticate(["penghasilan.lembur.delete"]),
  hapusUangLembur
);
export default router;
