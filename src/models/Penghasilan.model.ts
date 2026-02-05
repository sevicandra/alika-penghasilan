import sequelize from "@/config/db.config";
import DataLain from "./DataLain.model";
import DataLembur from "./DataLembur.model";
import DataMakan from "./DataMakan.model";
import RefBulan from "./RefBulan.model";
import ViewGaji from "./ViewGaji.model";
import ViewKurang from "./ViewKurang.model";
import TukinKurang from "./ViewTukinKurang.model";
import TukinRutin from "./ViewTukinRutin.model";

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

export default {
  Penghasilan,
};
