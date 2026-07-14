import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { AlikaService } from "@/services/alika.service";
import { KemenkeuService } from "@/services/kemenkeu.service";
import { minioService } from "@/services/minio-service";
import { PdfService } from "@/services/pdf.service";
import { ExternalServiceError, InternalServerError, NotFoundError } from "@/utils/errors";
import { fileResponse, successResponse } from "@/helpers/respose.helper";
import { sequelize } from "@/models";
import {
  DataCetak,
  DataGaji,
  DataKurang,
  DataLembur,
  DataMakan,
  DataNomor,
  DataProfil,
  DataSatker,
  DataTukin,
  RefBulan,
} from "@/repositories";

export const SkpControllerV1 = {
  preview: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InternalServerError("Transaction not found");
      }
      const current_tahun = new Date().getFullYear().toString();
      const { bulan, tahun, nip, kdsatker: kode_satker_params } = req.body;
      const {
        nama: name,
        jabatan: jabatan,
        kdSatker: kode_satker_hris,
      } = await KemenkeuService.getProfilHris2({ nip });

      const kode_satker = kode_satker_hris || kode_satker_params;

      if (!kode_satker || !name) {
        throw new ExternalServiceError("KemenkeuService", "Data HRIS Tidak Lengkap");
      }
      const jabatanDefinitif = jabatan.find((j) => j.statusJabatan == "Definitif");

      const satker = await DataSatker.findOne({
        where: { kdsatker: kode_satker },
      });
      if (!satker) {
        throw new NotFoundError("Satker Tidak Ditemukan");
      }
      const profil = await DataProfil.getPenandatangan(kode_satker, current_tahun, t);
      if (!profil) {
        throw new NotFoundError("Referensi Penandatangan Tidak Ditemukan");
      }
      const gaji = await DataGaji.findOne({
        where: {
          nip: nip,
          bulan: bulan,
          tahun: tahun,
        },
      });
      const kurang = await DataKurang.findOne({
        where: { nip: nip, tahun: tahun, bulan: bulan },
      });
      const tukin = await DataTukin.findOne({
        where: {
          nip: nip,
          bulan: bulan,
          tahun: tahun,
        },
        group: ["tahun", "bulan", "nip"],
        attributes: [
          "nip",
          "bulan",
          "tahun",
          [sequelize.fn("sum", sequelize.col("tjpokok")), "tjpokok"],
          [sequelize.fn("sum", sequelize.col("tjtamb")), "tjtamb"],
          [sequelize.fn("sum", sequelize.col("abspotp")), "abspotp"],
          [sequelize.fn("sum", sequelize.col("abspotr")), "abspotr"],
          [sequelize.fn("sum", sequelize.col("tkpph")), "tkpph"],
          [sequelize.fn("sum", sequelize.col("potpph")), "potpph"],
        ],
      });
      const makan = await DataMakan.findOne({
        where: {
          nip: nip,
          bulan: bulan,
          tahun: tahun,
        },
      });
      const lembur = await DataLembur.findOne({
        where: {
          nip: nip,
          bulan: bulan,
          tahun: tahun,
        },
      });
      const dataBulan = await RefBulan.findOne({ where: { kode: bulan } });
      if (!dataBulan) {
        throw new NotFoundError("Referensi Bulan Tidak Ditemukan");
      }
      const pdf = await PdfService.Skp({
        satker: satker,
        gaji: gaji,
        kurang: kurang,
        makan: makan,
        lembur: lembur,
        profil: profil,
        tukin: tukin,
        bulan: dataBulan,
        tahun: tahun,
        nama: name,
        nip: nip,
        jabatan: jabatanDefinitif?.namaJabatan || "-",
        organisasi: jabatanDefinitif?.organisasi || satker.nmsatker,
      });
      const pdfBuffer = Buffer.from(pdf, "base64");
      fileResponse(
        res,
        pdfBuffer,
        `SKP Bulan ${dataBulan.bulan} Tahun ${tahun} - ${name}_${nip}.pdf`,
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
      const current_tahun = new Date().getFullYear().toString();
      const { bulan, tahun, nip, kdsatker: kode_satker_params } = req.body;
      const {
        nama: name,
        jabatan: jabatan,
        kdSatker: kode_satker_hris,
      } = await KemenkeuService.getProfilHris2({ nip });

      const kode_satker = kode_satker_hris || kode_satker_params;

      if (!kode_satker || !name || !jabatan) {
        throw new ExternalServiceError("KemenkeuService", "Data HRIS Tidak Lengkap");
      }
      const jabatanDefinitif = jabatan.find((j) => j.statusJabatan == "Definitif");

      const satker = await DataSatker.findOne({
        where: { kdsatker: kode_satker },
      });
      if (!satker) {
        throw new NotFoundError("Satker Tidak Ditemukan");
      }
      const profil = await DataProfil.getPenandatangan(kode_satker, current_tahun, t);
      if (!profil) {
        throw new NotFoundError("Referensi Penandatangan Tidak Ditemukan");
      }
      const gaji = await DataGaji.findOne({
        where: {
          nip: nip,
          bulan: bulan,
          tahun: tahun,
        },
      });
      const kurang = await DataKurang.findOne({
        where: { nip: nip, tahun: tahun, bulan: bulan },
      });
      const tukin = await DataTukin.findOne({
        where: {
          nip: nip,
          bulan: bulan,
          tahun: tahun,
        },
        group: ["tahun", "bulan", "nip"],
        attributes: [
          "nip",
          "bulan",
          "tahun",
          [sequelize.fn("sum", sequelize.col("tjpokok")), "tjpokok"],
          [sequelize.fn("sum", sequelize.col("tjtamb")), "tjtamb"],
          [sequelize.fn("sum", sequelize.col("abspotp")), "abspotp"],
          [sequelize.fn("sum", sequelize.col("abspotr")), "abspotr"],
          [sequelize.fn("sum", sequelize.col("tkpph")), "tkpph"],
          [sequelize.fn("sum", sequelize.col("potpph")), "potpph"],
        ],
      });
      const makan = await DataMakan.findOne({
        where: {
          nip: nip,
          bulan: bulan,
          tahun: tahun,
        },
      });
      const lembur = await DataLembur.findOne({
        where: {
          nip: nip,
          bulan: bulan,
          tahun: tahun,
        },
      });
      const dataBulan = await RefBulan.findOne({ where: { kode: bulan } });
      if (!dataBulan) {
        throw new NotFoundError("Referensi Bulan Tidak Ditemukan");
      }
      const dataNomor = await DataNomor.getNomor(kode_satker, current_tahun, t);

      const pdf = await PdfService.Skp({
        satker: satker,
        gaji: gaji,
        kurang: kurang,
        makan: makan,
        lembur: lembur,
        profil: profil,
        tukin: tukin,
        bulan: dataBulan,
        tahun: tahun,
        nama: name,
        nip: nip,
        jabatan: jabatanDefinitif?.namaJabatan || "-",
        organisasi: jabatanDefinitif?.organisasi || satker.nmsatker,
        nomor: `${Number(dataNomor.no_urut_skp)}/${dataNomor.ext_skp}/${current_tahun}`,
      });

      const pdfBuffer = Buffer.from(pdf, "base64");
      const filename = `${uuid()}-${Date.now()}.pdf`;
      await minioService.uploadFile(pdfBuffer, filename, "application/pdf");
      await DataCetak.create(
        {
          tahun: current_tahun,
          nip_asal: nip,
          nip_tujuan: profil.nip_ttd_skp,
          nama_tujuan: profil.nama_ttd_skp,
          jenis: "skp",
          nomor: `${Number(dataNomor.no_urut_skp)}/${dataNomor.ext_skp}/${current_tahun}`,
          tanggal: Math.round(Date.now() / 1000),
          tujuan: name,
          perihal: `SKP Bulan ${(await dataBulan).bulan} Tahun ${tahun}`,
          file: filename,
          status: 0,
        },
        {
          transaction: t,
        }
      );

      dataNomor.no_urut_skp = dataNomor.no_urut_skp + 1;
      await dataNomor.save({ transaction: t });
      await AlikaService.sendPushNotification({
        nip: profil.nip_ttd_skp,
        message: `${name} mengirimkan permohonan SKP Bulan ${dataBulan.bulan} Tahun ${tahun}`,
      });
      await AlikaService.sendPushNotification({
        nip: nip,
        message: `Permohonan SKP Bulan ${dataBulan.bulan} Tahun ${tahun} sedang diproses oleh ${profil.nama_ttd_skp}.`,
      });

      successResponse(res, "Permohonan berhasil di kirim.");
    },
    {
      useTransaction: true,
    }
  ),
};
