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

router.get("/", authenticate(["penghasilan.gaji.read"]), getAllKekuranganGaji);
router.get(
  "/Count",
  authenticate(["penghasilan.gaji.read"]),
  countAllKekuranganGaji
);
router.get(
  "/GetTahun",
  authenticate(["penghasilan.gaji.read"]),
  getTahunKekuranganGaji
);
router.get(
  "/Tahun/:tahun/GetBulan",
  authenticate(["penghasilan.gaji.read"]),
  getBulanKekuranganGaji
);
router.get(
  "/:id",
  authenticate(["penghasilan.gaji.read"]),
  getKekuranganGajiById
);
router.post(
  "/",
  authenticate(["penghasilan.gaji.write"]),
  createKekuranganGaji
);
router.post(
  "/ImportCsv",
  authenticate(["penghasilan.gaji.import"]),
  upload.single("file"),
  importCsvKekuranganGaji
);
router.patch(
  "/:id",
  authenticate(["penghasilan.gaji.update"]),
  updateKekuranganGaji
);
router.delete(
  "/:id",
  authenticate(["penghasilan.gaji.delete"]),
  hapusKekuranganGaji
);

export default router;
