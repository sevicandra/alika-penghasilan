import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { AuthorizationError } from "@/utils/errors";
import sequelize from "@/config/db.config";
import { successResponse } from "@/helpers/respose.helper";
import {
  DataLain,
  DataLembur,
  DataMakan,
  RefBulan,
  ViewGaji,
  ViewKurang,
  ViewTukinKurang,
  ViewTukinRutin,
} from "@/repositories";

export const detailPenghasilan = asyncHandler(async (req: Request, res: Response) => {
  const nip = req.user?.nip;
  if (!nip) {
    throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
  }
  const tahun = (req.query.tahun as string) || undefined;
  const where: any = {
    nip: nip,
    tahun: tahun,
  };
  const gaji = await ViewGaji.findAll({
    where,
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.col("netto"), "netto"],
      [sequelize.col("bruto"), "bruto"],
      [sequelize.col("potongan"), "potongan"],
    ],
  });
  const gajiKurang = await ViewKurang.findAll({
    where,
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.col("netto"), "netto"],
      [sequelize.col("bruto"), "bruto"],
      [sequelize.col("potongan"), "potongan"],
    ],
  });
  const tukin = await ViewTukinRutin.findAll({
    where,
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.col("netto"), "netto"],
      [sequelize.col("bruto"), "bruto"],
      [sequelize.col("potongan"), "potongan"],
    ],
  });
  const tukinKurang = await ViewTukinKurang.findAll({
    where,
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.col("netto"), "netto"],
      [sequelize.col("bruto"), "bruto"],
      [sequelize.col("potongan"), "potongan"],
    ],
  });
  const makan = await DataMakan.findAll({
    where,
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.col("netto"), "netto"],
      [sequelize.col("bruto"), "bruto"],
      [sequelize.col("pph"), "pph"],
    ],
  });
  const lembur = await DataLembur.findAll({
    where,
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.col("netto"), "netto"],
      [sequelize.col("bruto"), "bruto"],
      [sequelize.col("pph"), "pph"],
    ],
  });
  const lain = await DataLain.findAll({
    where,
    group: ["bulan"],
    attributes: [
      [sequelize.col("bulan"), "bulan"],
      [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
      [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
      [sequelize.fn("SUM", sequelize.col("pph")), "pph"],
    ],
  });
  const refBulan = await RefBulan.findAll({
    attributes: ["kode", "bulan"],
  });
  const data = refBulan.map((item: any) => {
    const dataGaji = gaji.find((gaji) => {
      if (gaji.bulan === item.kode) {
        return {
          netto: gaji.netto,
          bruto: gaji.bruto,
          potongan: gaji.potongan,
        };
      }
      return null;
    });
    const kekuranganGaji = gajiKurang.find((gaji) => {
      if (gaji.bulan === item.kode) {
        return {
          netto: gaji.netto,
          bruto: gaji.bruto,
          potongan: gaji.potongan,
        };
      }
      return null;
    });
    const dataTukin = tukin.find((tukin) => {
      if (tukin.bulan === item.kode) {
        return {
          netto: tukin.netto,
          bruto: tukin.bruto,
          potongan: tukin.potongan,
        };
      }
      return null;
    });
    const kekuranganTukin = tukinKurang.find((tukin) => {
      if (tukin.bulan === item.kode) {
        return {
          netto: tukin.netto,
          bruto: tukin.bruto,
          potongan: tukin.potongan,
        };
      }
      return null;
    });
    const dataMakan = makan.find((makan) => {
      if (makan.bulan === item.kode) {
        return {
          netto: makan.netto,
          bruto: makan.bruto,
          potongan: makan.pph,
        };
      }
      return null;
    });
    const dataLembur = lembur.find((lembur) => {
      if (lembur.bulan === item.kode) {
        return {
          netto: lembur.netto,
          bruto: lembur.bruto,
          potongan: lembur.pph,
        };
      }
      return null;
    });
    const dataLain = lain.find((lain) => {
      if (lain.bulan === item.kode) {
        return {
          netto: lain.netto,
          bruto: lain.bruto,
          potongan: lain.pph,
        };
      }
      return null;
    });
    return {
      bulan: item.bulan,
      gaji: dataGaji || {
        netto: 0,
        bruto: 0,
        potongan: 0,
      },
      kekuranganGaji: kekuranganGaji || {
        netto: 0,
        bruto: 0,
        potongan: 0,
      },
      tukin: dataTukin || {
        netto: 0,
        bruto: 0,
        potongan: 0,
      },
      kekuranganTukin: kekuranganTukin || {
        netto: 0,
        bruto: 0,
        potongan: 0,
      },
      makan: dataMakan || {
        netto: 0,
        bruto: 0,
        potongan: 0,
      },
      lembur: dataLembur || {
        netto: 0,
        bruto: 0,
        potongan: 0,
      },
      lain: dataLain || {
        netto: 0,
        bruto: 0,
        potongan: 0,
      },
    };
  });
  successResponse(res, "success get detail penghasilan", data);
});
