import sequelize from "@/config/db.config";
import { DataTypes, Op } from "sequelize";
import ViewGaji from "./ViewGaji.model";
import ViewKurang from "./ViewKurang.model";
import TukinRutin from "./ViewTukinRutin.model";
import TukinKurang from "./ViewTukinKurang.model";
import DataMakan from "./DataMakan.model";
import DataLembur from "./DataLembur.model";
import DataLain from "./DataLain.model";
import RefBulan from "./RefBulan.model";
import ViewTukin from "./ViewTukin.model";

const Penghasilan = async ({ where }: { where: any }) => {
  const gaji = ViewGaji.findAll({
    where,
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.col("netto"), "netto"],
      [sequelize.col("bruto"), "bruto"],
      [sequelize.col("potongan"), "potongan"],
    ],
  });
  const gajiKurang = ViewKurang.findAll({
    where,
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.col("netto"), "netto"],
      [sequelize.col("bruto"), "bruto"],
      [sequelize.col("potongan"), "potongan"],
    ],
  });
  const tukin = TukinRutin.findAll({
    where,
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.col("netto"), "netto"],
      [sequelize.col("bruto"), "bruto"],
      [sequelize.col("potongan"), "potongan"],
    ],
  });
  const tukinKurang = TukinKurang.findAll({
    where,
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.col("netto"), "netto"],
      [sequelize.col("bruto"), "bruto"],
      [sequelize.col("potongan"), "potongan"],
    ],
  });
  const makan = DataMakan.findAll({
    where,
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.col("netto"), "netto"],
      [sequelize.col("bruto"), "bruto"],
      [sequelize.col("pph"), "potongan"],
    ],
  });
  const lembur = DataLembur.findAll({
    where,
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.col("netto"), "netto"],
      [sequelize.col("bruto"), "bruto"],
      [sequelize.col("pph"), "potongan"],
    ],
  });
  const lain = DataLain.findAll({
    where,
    group: ["bulan"],
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
      [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
      [sequelize.fn("SUM", sequelize.col("pph")), "potongan"],
    ],
  });
  const bulan = RefBulan.findAll({
    attributes: ["kode", "bulan"],
  });

  const dataGaji = await gaji;
  const dataGajiKurang = await gajiKurang;
  const dataTukin = await tukin;
  const dataTukinKurang = await tukinKurang;
  const dataMakan = await makan;
  const dataLembur = await lembur;
  const dataBulan = await bulan;
  const dataLain = await lain;

  return {
    dataGaji,
    dataGajiKurang,
    dataTukin,
    dataTukinKurang,
    dataMakan,
    dataLembur,
    dataLain,
    dataBulan,
  };
};

// const GajiTahunan = async ({ nip, tahun }: { nip: string; tahun: number }) => {
//   const gaji = ViewGaji.findAll({
//     where: { nip: nip, tahun: tahun },
//     attributes: [
//       [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
//       [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
//       [
//         sequelize.literal(`(
//             SELECT MIN(bulan) 
//             FROM view_gaji 
//             WHERE nip = ${nip} AND tahun = ${tahun}
//           )`),
//         "min_bulan",
//       ],
//       [
//         sequelize.literal(`(
//             SELECT MAX(bulan) 
//             FROM view_gaji 
//             WHERE nip = ${nip} AND tahun = ${tahun} AND bulan <= 12
//           )`),
//         "max_bulan",
//       ],
//     ],
//   });
//   const kurang = ViewKurang.findAll({
//     where: { nip: nip, tahun: tahun },
//     attributes: [
//       [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
//       [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
//     ],
//   });
//   const dataGaji = await gaji;
//   const dataKurang = await kurang;
//   return {
//     gaji: dataGaji[0],
//     kurang: dataKurang[0],
//   };
// };

// const TukinTahunan = async ({ nip, tahun }: { nip: string; tahun: number }) => {
//   const tukin = await ViewTukin.findAll({
//     where: { nip: nip, tahun: tahun },
//     attributes: [
//       [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
//       [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
//       [
//         sequelize.literal(`(
//         SELECT MIN(bulan) 
//         FROM view_tukin 
//         WHERE nip = ${nip} AND tahun = ${tahun}
//       )`),
//         "min_bulan",
//       ],
//       [
//         sequelize.literal(`(
//         SELECT MAX(bulan) 
//         FROM view_tukin 
//         WHERE nip = ${nip} AND tahun = ${tahun} AND bulan <= 12
//       )`),
//         "max_bulan",
//       ],
//     ],
//   });
//   return tukin[0];
// };

// const UangMakanTahunan = async ({
//   nip,
//   tahun,
// }: {
//   nip: string;
//   tahun: number;
// }) => {
//   const makan = await DataMakan.findAll({
//     where: { nip: nip, tahun: tahun },
//     attributes: [
//       [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
//       [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
//       [sequelize.fn("MIN", sequelize.col("bulan")), "min_bulan"],
//       [sequelize.fn("MAX", sequelize.col("bulan")), "max_bulan"],
//     ],
//   });
//   return makan[0];
// };

// const UangLemburTahunan = async ({
//   nip,
//   tahun,
// }: {
//   nip: string;
//   tahun: number;
// }) => {
//   const lembur = await DataLembur.findAll({
//     where: { nip: nip, tahun: tahun },
//     attributes: [
//       [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
//       [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
//       [sequelize.fn("MIN", sequelize.col("bulan")), "min_bulan"],
//       [sequelize.fn("MAX", sequelize.col("bulan")), "max_bulan"],
//     ],
//   });
//   return lembur[0];
// };

// const DataLainTahunan = async ({
//   nip,
//   tahun,
// }: {
//   nip: string;
//   tahun: number;
// }) => {
//   const data = await DataLain.findAll({
//     where: { nip: nip, tahun: tahun },
//     group: ["jenis"],
//     attributes: [
//       [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
//       [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
//       [sequelize.col("jenis"), "jenis"],
//     ],
//   });
//   return data;
// };

// const RiwayatGajiTahunan = async ({
//   nip,
//   tahunAwal,
//   tahunAkhir,
// }: {
//   nip: string;
//   tahunAwal: number;
//   tahunAkhir: number;
// }) => {
//   const data = await ViewGaji.findAll({
//     where: { nip: nip, tahun: { [Op.between]: [tahunAwal, tahunAkhir] } },
//     order: [["tahun", "ASC"]],
//     group: ["tahun"],
//     attributes: [
//       [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
//       [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
//       [sequelize.col("tahun"), "tahun"],
//     ],
//   });
//   return data;
// };

// const RiwayatGajiKurangTahunan = async ({
//   nip,
//   tahunAwal,
//   tahunAkhir,
// }: {
//   nip: string;
//   tahunAwal: number;
//   tahunAkhir: number;
// }) => {
//   const data = await ViewKurang.findAll({
//     where: { nip: nip, tahun: { [Op.between]: [tahunAwal, tahunAkhir] } },
//     order: [["tahun", "ASC"]],
//     group: ["tahun"],
//     attributes: [
//       [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
//       [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
//       [sequelize.col("tahun"), "tahun"],
//     ],
//   });
//   return data;
// };

// const RiwayatTukinTahunan = async ({
//   nip,
//   tahunAwal,
//   tahunAkhir,
// }: {
//   nip: string;
//   tahunAwal: number;
//   tahunAkhir: number;
// }) => {
//   const data = await TukinRutin.findAll({
//     where: { nip: nip, tahun: { [Op.between]: [tahunAwal, tahunAkhir] } },
//     order: [["tahun", "ASC"]],
//     group: ["tahun"],
//     attributes: [
//       [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
//       [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
//       [sequelize.col("tahun"), "tahun"],
//     ],
//   });
//   return data;
// };

// const RiwayatTukinKurangTahunan = async ({
//   nip,
//   tahunAwal,
//   tahunAkhir,
// }: {
//   nip: string;
//   tahunAwal: number;
//   tahunAkhir: number;
// }) => {
//   const data = await TukinKurang.findAll({
//     where: { nip: nip, tahun: { [Op.between]: [tahunAwal, tahunAkhir] } },
//     order: [["tahun", "ASC"]],
//     group: ["tahun"],
//     attributes: [
//       [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
//       [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
//       [sequelize.col("tahun"), "tahun"],
//     ],
//   });
//   return data;
// };

// const RiwayatUangMakan = async ({
//   nip,
//   tahunAwal,
//   tahunAkhir,
// }: {
//   nip: string;
//   tahunAwal: number;
//   tahunAkhir: number;
// }) => {
//   const data = await DataMakan.findAll({
//     where: { nip: nip, tahun: { [Op.between]: [tahunAwal, tahunAkhir] } },
//     order: [["tahun", "ASC"]],
//     group: ["tahun"],
//     attributes: [
//       [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
//       [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
//       [sequelize.col("tahun"), "tahun"],
//     ],
//   });
//   return data;
// };

// const RiwayatUangLembur = async ({
//   nip,
//   tahunAwal,
//   tahunAkhir,
// }: {
//   nip: string;
//   tahunAwal: number;
//   tahunAkhir: number;
// }) => {
//   const data = await DataLembur.findAll({
//     where: { nip: nip, tahun: { [Op.between]: [tahunAwal, tahunAkhir] } },
//     order: [["tahun", "ASC"]],
//     group: ["tahun"],
//     attributes: [
//       [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
//       [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
//       [sequelize.col("tahun"), "tahun"],
//     ],
//   });
//   return data;
// };

// const RiwayatLain = async ({
//   nip,
//   tahunAwal,
//   tahunAkhir,
// }: {
//   nip: string;
//   tahunAwal: number;
//   tahunAkhir: number;
// }) => {
//   const data = await DataLain.findAll({
//     where: { nip: nip, tahun: { [Op.between]: [tahunAwal, tahunAkhir] } },
//     order: [["tahun", "ASC"]],
//     group: ["tahun"],
//     attributes: [
//       [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
//       [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
//       [sequelize.col("tahun"), "tahun"],
//     ],
//   });
//   return data;
// };

export default {
  // GajiTahunan,
  // TukinTahunan,
  // UangMakanTahunan,
  // UangLemburTahunan,
  // DataLainTahunan,
  // RiwayatGajiTahunan,
  // RiwayatGajiKurangTahunan,
  // RiwayatTukinTahunan,
  // RiwayatTukinKurangTahunan,
  // RiwayatUangMakan,
  // RiwayatUangLembur,
  // RiwayatLain,
  Penghasilan,
};
