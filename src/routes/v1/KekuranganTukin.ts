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

router.get(
  "/",
  authenticate(["penghasilan.tukin.read"]),
  getAllKekuranganTukin
);
router.get(
  "/Count",
  authenticate(["penghasilan.tukin.read"]),
  countAllKekuranganTukin
);
router.get(
  "/GetTahun",
  authenticate(["penghasilan.tukin.read"]),
  getTahunKekuranganTukin
);
router.get(
  "/Tahun/:tahun/GetBulan",
  authenticate(["penghasilan.tukin.read"]),
  getBulanKekuranganTukin
);
router.get(
  "/:id",
  authenticate(["penghasilan.tukin.read"]),
  getKekuranganTukinById
);
router.post(
  "/",
  authenticate(["penghasilan.tukin.write"]),
  createKekuranganTukin
);
router.post(
  "/ImportCsv",
  authenticate(["penghasilan.tukin.import"]),
  upload.single("file"),
  importCsvKekuranganTukin
);
router.patch(
  "/:id",
  authenticate(["penghasilan.tukin.update"]),
  updateKekuranganTukin
);
router.delete(
  "/:id",
  authenticate(["penghasilan.tukin.delete"]),
  hapusKekuranganTukin
);

export default router;
