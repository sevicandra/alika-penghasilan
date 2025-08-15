import { Router } from "express";
import {
  getAllProfil,
  countAllProfil,
  getProfilById,
  createProfil,
  updateProfil,
  hapusProfil,
} from "@/controllers/v1/profil.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate(["penghasilan.profil.read"]), getAllProfil);
router.get("/Count", authenticate(["penghasilan.profil.read"]), countAllProfil);
router.get("/:id", authenticate(["penghasilan.profil.read"]), getProfilById);
router.post("/", authenticate(["penghasilan.profil.write"]), createProfil);
router.patch("/:id", authenticate(["penghasilan.profil.update"]), updateProfil);
router.delete("/:id", authenticate(["penghasilan.profil.delete"]), hapusProfil);
export default router;