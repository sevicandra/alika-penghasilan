import sequelize from "@/config/db.config";
import DataCetak from "./DataCetak.model";
import DataGaji from "./DataGaji.model";
import DataKurang from "./DataKurang.model";
import DataLain from "./DataLain.model";
import DataLembur from "./DataLembur.model";
import DataMakan from "./DataMakan.model";
import DataNomor from "./DataNomor.model";
import DataProfil from "./DataProfil.model";
import DataSatker from "./DataSatker.model";
import DataSptPegawai from "./DataSptPegawai.model";
import DataTukin from "./DataTukin.model";
import DataUnitPegawai from "./DataUnitPegawai.model";
import RefBulan from "./RefBulan.model";
import RefJabatan from "./RefJabatan.model";
import RefPangkat from "./RefPangkat.model";
import RefSptTahunan from "./RefSptTahunan.model";
import User from "./User.model";
import ViewGaji from "./ViewGaji.model";
import ViewKurang from "./ViewKurang.model";
import ViewPajakGaji from "./ViewPajakGaji.model";
import ViewPajakKurang from "./ViewPajakKurang.model";
import ViewTukin from "./ViewTukin.model";
import ViewTukinKurang from "./ViewTukinKurang.model";
import ViewTukinRutin from "./ViewTukinRutin.model";

DataGaji.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});
DataKurang.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});
DataLain.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});
DataLembur.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});
DataMakan.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});
DataSptPegawai.belongsTo(RefPangkat, {
  foreignKey: "kdgol",
  targetKey: "kdgol",
  as: "Pangkat",
});
DataSptPegawai.belongsTo(RefJabatan, {
  foreignKey: "kdjab",
  targetKey: "kode",
  as: "Jabatan",
});
ViewGaji.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "bulan",
  as: "Bulan",
});
ViewKurang.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "bulan",
  as: "Bulan",
});
ViewTukin.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});
ViewTukinKurang.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});
ViewTukinRutin.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});

export {
  DataCetak,
  DataGaji,
  DataKurang,
  DataLain,
  DataLembur,
  DataMakan,
  DataNomor,
  DataProfil,
  DataSptPegawai,
  DataTukin,
  DataUnitPegawai,
  RefBulan,
  RefJabatan,
  RefPangkat,
  RefSptTahunan,
  ViewGaji,
  ViewKurang,
  ViewTukin,
  ViewTukinKurang,
  ViewTukinRutin,
  DataSatker,
  ViewPajakGaji,
  ViewPajakKurang,
  User,
  sequelize,
};
