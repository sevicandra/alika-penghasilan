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

router.get("/", authenticate(["penghasilan.tukin.read"]), getAllTukin);
router.get("/Count", authenticate(["penghasilan.tukin.read"]), countAllTukin);
router.get(
  "/GetTahun",
  authenticate(["penghasilan.tukin.read"]),
  getTahunTukin
);
router.get(
  "/Tahun/:tahun/GetBulan",
  authenticate(["penghasilan.tukin.read"]),
  getBulanTukin
);
router.get("/:id", authenticate(["penghasilan.tukin.read"]), getTukinById);
router.post("/", authenticate(["penghasilan.tukin.write"]), createTukin);
router.post(
  "/ImportCsv",
  authenticate(["penghasilan.tukin.import"]),
  upload.single("file"),
  importCsvTukin
);
router.patch("/:id", authenticate(["penghasilan.tukin.update"]), updateTukin);
router.delete("/:id", authenticate(["penghasilan.tukin.delete"]), hapusTukin);

export default router;
