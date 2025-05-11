import { Router } from "express";
import {
  getAllProfil,
  countAllProfil,
  getProfilById,
  createProfil,
  updateProfil,
  hapusProfil,
} from "@/controllers/v1/profil.controller";

const router = Router();
router.get("/", getAllProfil);
router.get("/Count", countAllProfil);
router.get("/:id", getProfilById);
router.post("/", createProfil);
router.put("/:id", updateProfil);
router.delete("/:id", hapusProfil);
export default router;