import { Request, Response } from "express";
import { Op } from "sequelize";
import { v4 as uuid } from "uuid";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { KemenkeuService } from "@/services/kemenkeu.service";
import { minioService } from "@/services/minio-service";
import { PdfService } from "@/services/pdf.service";
import { ExternalServiceError, InternalServerError, NotFoundError } from "@/utils/errors";
import { fileResponse, successResponse } from "@/helpers/respose.helper";
import { DataCetak, DataGaji, DataNomor, DataProfil, DataSatker } from "@/repositories";

export const Kp4ControllerV1 = {
  preview: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InternalServerError("Transaction not found");
      }
      const current_tahun = new Date().getFullYear().toString();
      const { nip } = req.body;
      const {
        tempatLahir: tempatLahir,
        tanggalLahir: tanggalLahir,
        jabatan: jabatan,
        nama: name,
        namaSatker: namaSatker,
        pangkat: pangkat,
        kdSatker: kode_satker,
      } = await KemenkeuService.getProfilHris2({ nip });
      if (
        !tempatLahir ||
        !tanggalLahir ||
        !jabatan ||
        !name ||
        !namaSatker ||
        !pangkat ||
        !kode_satker
      ) {
        throw new ExternalServiceError("KemenkeuService", "Data HRIS Tidak Lengkap");
      }
      const jabatanDefinitif = jabatan.find((j) => j.statusJabatan == "Definitif");
      if (!jabatanDefinitif) {
        throw new ExternalServiceError("KemenkeuService", "Data Jabatan Definitif tidak ditemukan");
      }
      const keluarga = await KemenkeuService.getKeluarga({ nip });
      keluarga.sort(
        (a: any, b: any) => new Date(a.TanggalLahir).getTime() - new Date(b.TanggalLahir).getTime()
      );

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
      const dataGaji = await DataGaji.findOne({
        where: { nip: nip, bulan: { [Op.lte]: 12 } },
        order: [
          ["tahun", "DESC"],
          ["bulan", "DESC"],
        ],
      });
      if (!dataGaji) {
        throw new NotFoundError("Data Gaji Tidak Ditemukan");
      }
      const pdf = await PdfService.KP4({
        keluargas: keluarga,
        gaji: dataGaji,
        nip: nip as string,
        nama: name,
        tempatLahir: tempatLahir,
        tanggalLahir: tanggalLahir,
        jabatan: jabatanDefinitif.namaJabatan,
        namaSatker: namaSatker,
        golongan: `${pangkat.namaPangkat} / ${pangkat.kodeGolongan}`,
        profil: profil,
        satker: satker,
      });

      const pdfBuffer = Buffer.from(pdf, "base64");

      fileResponse(res, pdfBuffer, `KP4 - ${name}_${nip}.pdf`, "application/pdf");
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
      const { nip } = req.body;
      const {
        tempatLahir: tempatLahir,
        tanggalLahir: tanggalLahir,
        jabatan: jabatan,
        nama: name,
        namaSatker: namaSatker,
        pangkat: pangkat,
        kdSatker: kode_satker,
      } = await KemenkeuService.getProfilHris2({ nip });
      if (
        !tempatLahir ||
        !tanggalLahir ||
        !jabatan ||
        !name ||
        !namaSatker ||
        !pangkat ||
        !kode_satker
      ) {
        throw new ExternalServiceError("KemenkeuService", "Data HRIS Tidak Lengkap");
      }

      const jabatanDefinitif = jabatan.find((j) => j.statusJabatan == "Definitif");
      if (!jabatanDefinitif) {
        throw new ExternalServiceError("KemenkeuService", "Data Jabatan Definitif tidak ditemukan");
      }
      const keluarga = await KemenkeuService.getKeluarga({ nip });
      keluarga.sort(
        (a: any, b: any) => new Date(a.TanggalLahir).getTime() - new Date(b.TanggalLahir).getTime()
      );

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
      const dataGaji = await DataGaji.findOne({
        where: { nip: nip, bulan: { [Op.lte]: 12 } },
        order: [
          ["tahun", "DESC"],
          ["bulan", "DESC"],
        ],
      });
      if (!dataGaji) {
        throw new NotFoundError("Data Gaji Tidak Ditemukan");
      }
      const dataNomor = await DataNomor.getNomor(kode_satker, current_tahun, t);

      const pdf = await PdfService.KP4({
        keluargas: keluarga,
        gaji: dataGaji,
        nip: nip,
        nama: name,
        tempatLahir: tempatLahir,
        tanggalLahir: tanggalLahir,
        jabatan: jabatanDefinitif.namaJabatan,
        namaSatker: namaSatker,
        golongan: `${pangkat.namaPangkat} / ${pangkat.kodeGolongan}`,
        profil: profil,
        satker: satker,
      });

      const pdfBuffer = Buffer.from(pdf, "base64");
      const filename = `${uuid()}-${Date.now()}.pdf`;
      await minioService.uploadFile(pdfBuffer, filename, "application/pdf");
      await DataCetak.create(
        {
          tahun: current_tahun,
          nip_asal: nip,
          nip_tujuan: nip,
          nama_tujuan: name,
          jenis: "KP4S",
          nomor: `${Number(dataNomor.no_urut_kp4)}/${dataNomor.ext_kp4}/${current_tahun}`,
          tanggal: Math.round(Date.now() / 1000),
          tujuan: `${profil.nama_ttd_kp4}/${profil.nip_ttd_kp4}`,
          perihal: `KP4 Tahun ${new Date().getFullYear()}`,
          file: filename,
          status: 0,
        },
        {
          transaction: t,
        }
      );
      dataNomor.no_urut_kp4 = `${Number(dataNomor.no_urut_kp4) + 1}`;
      await dataNomor.save({ transaction: t });
      successResponse(res, "Cetak KP4 Berhasil");
    },
    {
      useTransaction: true,
    }
  ),
};
