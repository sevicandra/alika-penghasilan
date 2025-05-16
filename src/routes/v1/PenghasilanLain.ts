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
  authenticate(["penghasilan.penghasilanlain.read"]),
  getAllPenghasilanLain
);
router.get(
  "/Count",
  authenticate(["penghasilan.penghasilanlain.read"]),
  countAllPenghasilanLain
);
router.get(
  "/GetTahun",
  authenticate(["penghasilan.penghasilanlain.read"]),
  getTahunPenghasilanLain
);
router.get(
  "/Tahun/:tahun/GetBulan",
  authenticate(["penghasilan.penghasilanlain.read"]),
  getBulanPenghasilanLain
);
router.get(
  "/GetJenis",
  authenticate(["penghasilan.penghasilanlain.read"]),
  getJenisPenghasilanLain
);
router.get(
  "/:id",
  authenticate(["penghasilan.penghasilanlain.read"]),
  getPenghasilanLainById
);
router.post(
  "/",
  authenticate(["penghasilan.penghasilanlain.write"]),
  createPenghasilanLain
);
router.post(
  "/ImportCsv",
  authenticate(["penghasilan.penghasilanlain.import"]),
  upload.single("file"),
  importCsvPenghasilanLain
);
router.patch(
  "/:id",
  authenticate(["penghasilan.penghasilanlain.update"]),
  updatePenghasilanLain
);
router.delete(
  "/:id",
  authenticate(["penghasilan.penghasilanlain.delete"]),
  hapusPenghasilanLain
);

export default router;
