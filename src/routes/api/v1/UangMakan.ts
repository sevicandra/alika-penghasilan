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
router.get("/", authenticate(["penghasilan.makan.read"]), getAllUangMakan);
router.get(
  "/Count",
  authenticate(["penghasilan.makan.read"]),
  countAllUangMakan
);
router.get(
  "/GetTahun",
  authenticate(["penghasilan.makan.read"]),
  getTahunUangMakan
);
router.get(
  "/Tahun/:tahun/GetBulan",
  authenticate(["penghasilan.makan.read"]),
  getBulanUangMakan
);
router.get("/:id", authenticate(["penghasilan.makan.read"]), getUangMakanById);
router.post("/", authenticate(["penghasilan.makan.write"]), createUangMakan);
router.post(
  "/ImportCsv",
  authenticate(["penghasilan.makan.import"]),
  upload.single("file"),
  importCsvUangMakan
);
router.patch("/:id", authenticate(["penghasilan.makan.update"]), updateUangMakan);
router.delete(
  "/:id",
  authenticate(["penghasilan.makan.delete"]),
  hapusUangMakan
);
export default router;
