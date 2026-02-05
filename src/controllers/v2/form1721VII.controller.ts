import { Request, Response } from "express";
import { Op } from "sequelize";
import { v4 as uuid } from "uuid";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { AlikaService } from "@/services/alika.service";
import { KemenkeuService } from "@/services/kemenkeu.service";
import { minioService } from "@/services/minio-service";
import { PdfService } from "@/services/pdf.service";
import {
  AuthorizationError,
  ExternalServiceError,
  InternalServerError,
  NotFoundError,
} from "@/utils/errors";
import { fileResponse, successResponse } from "@/helpers/respose.helper";
import { sequelize } from "@/models";
import {
  DataCetak,
  DataLain,
  DataLembur,
  DataMakan,
  DataNomor,
  DataProfil,
  DataSatker,
  DataSptPegawai,
} from "@/repositories";

export const SPTFinalControllerV2 = {
  preview: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InternalServerError("Transaction not found");
      }
      const nip = req.user?.nip;
      if (!nip) {
        throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
      }
      const current_tahun = new Date().getFullYear().toString();
      const { tahun } = req.body;
      const { nama: name } = await KemenkeuService.getProfilHris2({ nip });
      if (!name) {
        throw new ExternalServiceError("KemenkeuService", "Data HRIS Tidak Lengkap");
      }
      const pegawai = await DataSptPegawai.findOne({
        where: {
          nip: nip,
          tahun: tahun,
        },
      });
      if (!pegawai) {
        throw new NotFoundError("Data SPT Pegawai Tidak Ditemukan");
      }

      const satker = await DataSatker.findOne({
        where: { kdsatker: pegawai.kdsatker },
      });
      if (!satker) {
        throw new NotFoundError("Satker Tidak Ditemukan");
      }
      const profil = await DataProfil.getPenandatangan(pegawai.kdsatker, current_tahun, t);
      if (!profil) {
        throw new NotFoundError("Referensi Penandatangan Tidak Ditemukan");
      }
      const dataMakan = await DataMakan.findOne({
        where: { nip: nip, tahun: tahun },
        group: ["nip", "tahun"],
        attributes: [
          [sequelize.fn("SUM", sequelize.col("pph")), "pph"],
          [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
          [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
          "nip",
          "tahun",
        ],
      });
      const dataLembur = await DataLembur.findOne({
        where: { nip: nip, tahun: tahun },
        group: ["nip", "tahun"],
        attributes: [
          [sequelize.fn("SUM", sequelize.col("pph")), "pph"],
          [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
          [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
          "nip",
          "tahun",
        ],
      });
      const dataLains = await DataLain.findAll({
        where: {
          nip: nip,
          tahun: tahun,
          jenis: { [Op.notIn]: ["perjadin", "rapel-tukin"] },
        },
        group: ["jenis"],
        attributes: [
          [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
          [sequelize.fn("SUM", sequelize.col("pph")), "pph"],
          [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
          "jenis",
        ],
      });
      const pdf = await PdfService.Form1721VII({
        pegawai: pegawai,
        satker: satker,
        profil: profil,
        makan: dataMakan,
        lembur: dataLembur,
        lains: dataLains,
        nama: name,
        nip: nip,
      });

      const pdfBuffer = Buffer.from(pdf, "base64");

      fileResponse(
        res,
        pdfBuffer,
        `Form 1721-VII Tahun ${tahun} - ${name}_${nip}.pdf`,
        "application/pdf"
      );
    },
    {
      useTransaction: true,
    }
  ),
  cetak: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InternalServerError("Transaction not found");
      }
      const nip = req.user?.nip;
      if (!nip) {
        throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
      }
      const current_tahun = new Date().getFullYear().toString();
      const { tahun } = req.body;
      const { nama: name } = await KemenkeuService.getProfilHris2({ nip });
      if (!name) {
        throw new ExternalServiceError("KemenkeuService", "Data HRIS Tidak Lengkap");
      }
      const pegawai = await DataSptPegawai.findOne({
        where: {
          nip: nip,
          tahun: tahun,
        },
      });
      if (!pegawai) {
        throw new NotFoundError("Data SPT Pegawai Tidak Ditemukan");
      }
      const satker = await DataSatker.findOne({
        where: { kdsatker: pegawai.kdsatker },
      });
      if (!satker) {
        throw new NotFoundError("Satker Tidak Ditemukan");
      }
      const profil = await DataProfil.getPenandatangan(pegawai.kdsatker, current_tahun, t);
      if (!profil) {
        throw new NotFoundError("Referensi Penandatangan Tidak Ditemukan");
      }
      const dataMakan = await DataMakan.findOne({
        where: { nip: nip, tahun: tahun },
        group: ["nip", "tahun"],
        attributes: [
          [sequelize.fn("SUM", sequelize.col("pph")), "pph"],
          [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
          [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
          "nip",
          "tahun",
        ],
      });
      const dataLembur = await DataLembur.findOne({
        where: { nip: nip, tahun: tahun },
        group: ["nip", "tahun"],
        attributes: [
          [sequelize.fn("SUM", sequelize.col("pph")), "pph"],
          [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
          [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
          "nip",
          "tahun",
        ],
      });
      const dataLains = await DataLain.findAll({
        where: {
          nip: nip,
          tahun: tahun,
          jenis: { [Op.notIn]: ["perjadin", "rapel-tukin"] },
        },
        group: ["jenis"],
        attributes: [
          [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
          [sequelize.fn("SUM", sequelize.col("pph")), "pph"],
          [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
          "jenis",
        ],
      });
      const dataNomor = await DataNomor.getNomor(pegawai.kdsatker, current_tahun, t);

      const pdf = await PdfService.Form1721VII({
        pegawai: pegawai,
        satker: satker,
        profil: profil,
        makan: dataMakan,
        lembur: dataLembur,
        lains: dataLains,
        nama: name,
        nip: nip,
        nomor: `${Number(dataNomor.no_urut_final)}${dataNomor.ext_final}/${current_tahun}`,
        tanggal: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      });

      const pdfBuffer = Buffer.from(pdf, "base64");
      const filename = `${uuid()}-${Date.now()}.pdf`;
      await minioService.uploadFile(pdfBuffer, filename, "application/pdf");
      await DataCetak.create(
        {
          tahun: current_tahun,
          nip_asal: nip,
          nip_tujuan: profil.nip_bendahara,
          nama_tujuan: profil.nama_bendahara,
          jenis: "pph-final",
          nomor: `${Number(dataNomor.no_urut_final)}/${dataNomor.ext_final}/${current_tahun}`,
          tanggal: Math.round(Date.now() / 1000),
          tujuan: name,
          perihal: `Bukti Potong PPh Pasal 21 Final Tahun ${tahun}`,
          file: filename,
          status: 0,
        },
        {
          transaction: t,
        }
      );

      dataNomor.no_urut_final = `${Number(dataNomor.no_urut_final) + 1}`;
      await dataNomor.save({ transaction: t });
      await AlikaService.sendPushNotification({
        nip: profil.nip_bendahara,
        message: `${name} mengirimkan permohonan Bukti Potong PPh Pasal 21 Final Tahun ${tahun}`,
      });
      await AlikaService.sendPushNotification({
        nip: nip,
        message: `Permohonan Bukti Potong PPh Pasal 21 Final Tahun ${tahun} sedang diproses oleh bendahara.`,
      });

      successResponse(res, "Permohonan berhasil di kirim.");
    },
    {
      useTransaction: true,
    }
  ),
};
