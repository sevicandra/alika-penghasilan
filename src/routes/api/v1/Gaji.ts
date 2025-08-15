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

router.get("/", authenticate(["penghasilan.gaji.read"]), getAllGaji);
router.get("/Count", authenticate(["penghasilan.gaji.read"]), countAllGaji);
router.get("/GetTahun", authenticate(["penghasilan.gaji.read"]), getTahunGaji);
router.get(
  "/Tahun/:tahun/GetBulan",
  authenticate(["penghasilan.gaji.read"]),
  getBulanGaji
);
router.get("/:id", authenticate(["penghasilan.gaji.read"]), getGajiById);
router.post("/", authenticate(["penghasilan.gaji.write"]), createGaji);
router.post(
  "/ImportCsv",
  authenticate(["penghasilan.gaji.import"]),
  upload.single("file"),
  importCsvGaji
);
router.patch("/:id", authenticate(["penghasilan.gaji.update"]),updateGaji);
router.delete("/:id", authenticate(["penghasilan.gaji.delete"]),hapusGaji);

export default router;
