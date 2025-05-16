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

router.use("/DataCetak", DataCetak);
router.use("/1721-A2", Form1721A2);
router.use("/1721-VII", Form1721VII);
router.use("/DaftarGaji", DaftarGaji);
router.use("/DataNomor", DataNomor);
router.use(
  "/DataSptPegawai",
  authenticate(["alk2.dataSptPegawai"]),
  DataSptPegawai
);
router.use("/FilePreview", FilePreview);
router.use("/Gaji", Gaji);
router.use(
  "/KekuranganGaji",
  authenticate(["alk2.kekuranganGaji"]),
  KekuranganGaji
);
router.use("/Tukin", Tukin);
router.use(
  "/KekuranganTukin",
  authenticate(["alk2.kekuranganTukin"]),
  KekuranganTukin
);
router.use("/KP4", KP4);
router.use(
  "/PenghasilanLain",
  authenticate(["alk2.penghasilanLain"]),
  PenghasilanLain
);
router.use("/Profil", Profil);
router.use("/RefJabatan", RefJabatan);
router.use("/RefSatker", RefSatker);
router.use(
  "/RefSptTahunan",
  authenticate(["alk2.refSptTahunan"]),
  RefSptTahunan
);
router.use("/Skp", Skp);
router.use("/UangLembur", UangLembur);
router.use("/UangMakan", UangMakan);

export default router;
