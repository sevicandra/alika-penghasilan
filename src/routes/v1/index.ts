import { Router } from "express";
import DataCetak from "./DataCetak";
import Form1721A2 from "./Form1721A2";
import Form1721VII from "./Form1721VII";
import DaftarGaji from "./DaftarGaji";
import DataNomor from "./DataNomor";
import DataSptPegawai from "./DataSptPegawai";
import FilePreview from "./FilePreview";
import Gaji from "./Gaji";
import KekuranganGaji from "./KekuranganGaji";
import Tukin from "./Tukin";
import KekuranganTukin from "./KekuranganTukin";
import KP4 from "./KP4";
import PenghasilanLain from "./PenghasilanLain";
import Profil from "./Profil";
import RefJabatan from "./RefJabatan";
import RefSatker from "./RefSatker";
import RefSptTahunan from "./RefSptTahunan";
import Skp from "./Skp";
import UangLembur from "./UangLembur";
import UangMakan from "./UangMakan";

import { authenticate } from "@/middlewares/auth.middleware";
const router = Router();

router.use("/DataCetak", authenticate(["alk2.dataCetak"]), DataCetak);
router.use("/1721-A2", authenticate(["alk2.PPh"]), Form1721A2);
router.use("/1721-VII", authenticate(["alk2.PPhFinal"]), Form1721VII);
router.use("/DaftarGaji", authenticate(["alk2.daftarGaji"]), DaftarGaji);
router.use("/DataNomor", authenticate(["alk2.dataNomor"]), DataNomor);
router.use(
  "/DataSptPegawai",
  authenticate(["alk2.dataSptPegawai"]),
  DataSptPegawai
);
router.use("/FilePreview", authenticate(["alk2.filePreview"]), FilePreview);
router.use("/Gaji", authenticate(["alk2.gaji"]), Gaji);
router.use(
  "/KekuranganGaji",
  authenticate(["alk2.kekuranganGaji"]),
  KekuranganGaji
);
router.use("/Tukin", authenticate(["alk2.tukin"]), Tukin);
router.use(
  "/KekuranganTukin",
  authenticate(["alk2.kekuranganTukin"]),
  KekuranganTukin
);
router.use("/KP4", authenticate(["alk2.kp4"]), KP4);
router.use(
  "/PenghasilanLain",
  authenticate(["alk2.penghasilanLain"]),
  PenghasilanLain
);
router.use("/Profil", authenticate(["alk2.profil"]), Profil);
router.use("/RefJabatan", authenticate(["alk2.refJabatan"]), RefJabatan);
router.use("/RefSatker", authenticate(["alk2.refSatker"]), RefSatker);
router.use(
  "/RefSptTahunan",
  authenticate(["alk2.refSptTahunan"]),
  RefSptTahunan
);
router.use("/Skp", authenticate(["alk2.skp"]), Skp);
router.use("/UangLembur", authenticate(["alk2.uangLembur"]), UangLembur);
router.use("/UangMakan", authenticate(["alk2.uangMakan"]), UangMakan);

export default router;
