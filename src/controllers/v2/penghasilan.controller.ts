import { AuthenticatedRequest } from "@/types/auth";
import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import {
  DataMakan,
  DataLembur,
  DataLain,
  ViewGaji,
  RefBulan,
  ViewKurang,
  ViewTukinRutin,
  ViewTukinKurang,
} from "@/models";
import sequelize from "@/config/db.config";
export const detailPenghasilan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const tahun = req.query.tahun as string;
    if (!tahun) {
      return errorResponse(res, "Tahun tidak ditemukan.", 400);
    }

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
        [sequelize.col("pph"), "potongan"],
      ],
    });
    const lembur = await DataLembur.findAll({
      where,
      attributes: [
        [sequelize.col("bulan"), "bulan"],
        [sequelize.col("netto"), "netto"],
        [sequelize.col("bruto"), "bruto"],
        [sequelize.col("pph"), "potongan"],
      ],
    });
    const lain = await DataLain.findAll({
      where,
      group: ["bulan"],
      attributes: [
        [sequelize.col("bulan"), "bulan"],
        [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
        [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
        [sequelize.fn("SUM", sequelize.col("pph")), "potongan"],
      ],
    });
    const refBulan = await RefBulan.findAll({
      attributes: ["kode", "bulan"],
    });
    const data = refBulan.map((item: any) => {
      const dataGaji = gaji.filter((gaji: any) => {
        if (gaji.bulan === item.kode) {
          return {
            netto: gaji.netto,
            bruto: gaji.bruto,
            potongan: gaji.potongan,
          };
        }
      });
      const kekuranganGaji = gajiKurang.filter((gaji: any) => {
        if (gaji.bulan === item.kode) {
          return {
            netto: gaji.netto,
            bruto: gaji.bruto,
            potongan: gaji.potongan,
          };
        }
      });
      const dataTukin = tukin.filter((tukin: any) => {
        if (tukin.bulan === item.kode) {
          return {
            netto: tukin.netto,
            bruto: tukin.bruto,
            potongan: tukin.potongan,
          };
        }
      });
      const kekuranganTukin = tukinKurang.filter((tukin: any) => {
        if (tukin.bulan === item.kode) {
          return {
            netto: tukin.netto,
            bruto: tukin.bruto,
            potongan: tukin.potongan,
          };
        }
      });
      const dataMakan = makan.filter((makan: any) => {
        if (makan.bulan === item.kode) {
          return {
            netto: makan.netto,
            bruto: makan.bruto,
            potongan: makan.potongan,
          };
        }
      });
      const dataLembur = lembur.filter((lembur: any) => {
        if (lembur.bulan === item.kode) {
          return {
            netto: lembur.netto,
            bruto: lembur.bruto,
            potongan: lembur.potongan,
          };
        }
      });
      const dataLain = lain.filter((lain: any) => {
        if (lain.bulan === item.kode) {
          return {
            netto: lain.netto,
            bruto: lain.bruto,
            potongan: lain.potongan,
          };
        }
      });
      return {
        bulan: item.bulan,
        gaji: dataGaji[0] || {
          netto: 0,
          bruto: 0,
          potongan: 0,
        },
        kekuranganGaji: kekuranganGaji[0] || {
          netto: 0,
          bruto: 0,
          potongan: 0,
        },
        tukin: dataTukin[0] || {
          netto: 0,
          bruto: 0,
          potongan: 0,
        },
        kekuranganTukin: kekuranganTukin[0] || {
          netto: 0,
          bruto: 0,
          potongan: 0,
        },
        makan: dataMakan[0] || {
          netto: 0,
          bruto: 0,
          potongan: 0,
        },
        lembur: dataLembur[0] || {
          netto: 0,
          bruto: 0,
          potongan: 0,
        },
        lain: dataLain[0] || {
          netto: 0,
          bruto: 0,
          potongan: 0,
        },
      };
    });
    return successResponse(res, "success get detail penghasilan", data);
  } catch (error: unknown) {
    next(error);
  }
};
