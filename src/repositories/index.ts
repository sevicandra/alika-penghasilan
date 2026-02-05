import { DataCetakRepository } from "./data-cetak";
import { DataGajiRepository } from "./data-gaji";
import { DataKurangRepository } from "./data-kurang";
import { DataLainRepository } from "./data-lain";
import { DataLemburRepository } from "./data-lembur";
import { DataMakanRepository } from "./data-makan";
import { DataNomorRepository } from "./data-nomor";
import { DataProfilRepository } from "./data-profil";
import { DataSatkerRepository } from "./data-satker";
import { DataSptPegawaiRepository } from "./data-spt-pegawai";
import { DataTukinRepository } from "./data-tukin";
import { DataUnitPegawaiRepository } from "./data-unit-pegawai";
import { RefBulanRepository } from "./ref-bulan";
import { RefJabatanRepository } from "./ref-jabatan";
import { RefPangkatRepository } from "./ref-pangkat";
import { RefSptTahunanRepository } from "./ref-spt-tahunan";
import { UserRepository } from "./user";
import { ViewGajiRepository } from "./view-gaji";
import { ViewKurangRepository } from "./view-kurang";
import { ViewPajakGajiRepository } from "./view-pajak-gaji";
import { ViewPajakKurangRepository } from "./view-pajak-kurang";
import { ViewTukinRepository } from "./view-tukin";
import { ViewTukinKurangRepository } from "./view-tukin-kurang";
import { ViewTukinRutinRepository } from "./view-tukin-rutin";

const DataCetak = new DataCetakRepository();
const DataGaji = new DataGajiRepository();
const DataKurang = new DataKurangRepository();
const DataLain = new DataLainRepository();
const DataLembur = new DataLemburRepository();
const DataMakan = new DataMakanRepository();
const DataNomor = new DataNomorRepository();
const DataProfil = new DataProfilRepository();
const DataSatker = new DataSatkerRepository();
const DataSptPegawai = new DataSptPegawaiRepository();
const DataTukin = new DataTukinRepository();
const DataUnitPegawai = new DataUnitPegawaiRepository();
const RefBulan = new RefBulanRepository();
const RefJabatan = new RefJabatanRepository();
const RefPangkat = new RefPangkatRepository();
const RefSptTahunan = new RefSptTahunanRepository();
const User = new UserRepository();
const ViewGaji = new ViewGajiRepository();
const ViewKurang = new ViewKurangRepository();
const ViewPajakGaji = new ViewPajakGajiRepository();
const ViewPajakKurang = new ViewPajakKurangRepository();
const ViewTukinKurang = new ViewTukinKurangRepository();
const ViewTukinRutin = new ViewTukinRutinRepository();
const ViewTukin = new ViewTukinRepository();

export {
  DataCetak,
  DataGaji,
  DataKurang,
  DataLain,
  DataLembur,
  DataMakan,
  DataNomor,
  DataProfil,
  DataSatker,
  DataSptPegawai,
  DataTukin,
  DataUnitPegawai,
  RefBulan,
  RefJabatan,
  RefPangkat,
  RefSptTahunan,
  User,
  ViewGaji,
  ViewKurang,
  ViewPajakGaji,
  ViewPajakKurang,
  ViewTukinKurang,
  ViewTukinRutin,
  ViewTukin,
};
