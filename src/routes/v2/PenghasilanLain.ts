import { Router } from "express";
import {
  getAllPenghasilanLain,
  getBulanPenghasilanLain,
  getJenisPenghasilanLain,
  getPenghasilanLainById,
  getRekapPenghasilanLain,
  getTahunPenghasilanLain,
  countAllPenghasilanLain,
} from "@/controllers/v2/penghasilanLain.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(["penghasilan2.penghasilanlain.read"]),getAllPenghasilanLain);
router.get("/Count", authenticate(["penghasilan2.penghasilanlain.read"]),countAllPenghasilanLain);
router.get("/GetTahun", authenticate(["penghasilan2.penghasilanlain.read"]),getTahunPenghasilanLain);
router.get("/Tahun/:tahun/GetBulan", authenticate(["penghasilan2.penghasilanlain.read"]),getBulanPenghasilanLain);
router.get("/GetJenis", authenticate(["penghasilan2.penghasilanlain.read"]),getJenisPenghasilanLain);
router.get("/GetRekap", authenticate(["penghasilan2.penghasilanlain.read"]),getRekapPenghasilanLain);
router.get("/:id", authenticate(["penghasilan2.penghasilanlain.read"]),getPenghasilanLainById);
export default router;
