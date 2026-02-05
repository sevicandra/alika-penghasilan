import { Request, Response } from "express";
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
import {
  DataCetak,
  DataGaji,
  DataNomor,
  DataProfil,
  DataSatker,
  RefBulan,
  ViewGaji,
} from "@/repositories";

export const DaftarGajiControllerV2 = {
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
      const { bulan, tahun } = req.body;
      const {
        nama: name,
        jabatan: jabatan,
        kdSatker: kode_satker,
      } = await KemenkeuService.getProfilHris2({ nip });

      if (!kode_satker || !name || !jabatan) {
        throw new ExternalServiceError("KemenkeuService", "Data HRIS Tidak Lengkap");
      }
      const jabatanDefinitif = jabatan.find((j) => j.statusJabatan == "Definitif");
      if (!jabatanDefinitif) {
        throw new ExternalServiceError("KemenkeuService", "Data Jabatan Definitif tidak ditemukan");
      }

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
      const viewGaji = await ViewGaji.findOne({
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
      const pdf = await PdfService.DaftarGaji({
        satker: satker,
        gaji: gaji,
        profil: profil,
        bulan: dataBulan,
        viewGaji: viewGaji,
        tahun: tahun,
        nama: name,
        nip: nip,
        jabatan: jabatanDefinitif.namaJabatan,
      });
      const pdfBuffer = Buffer.from(pdf, "base64");
      fileResponse(
        res,
        pdfBuffer,
        `Daftar Gaji Bulan ${dataBulan.bulan} Tahun ${tahun} - ${name}_${nip}.pdf`,
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
      const { bulan, tahun } = req.body;
      const {
        nama: name,
        jabatan: jabatan,
        kdSatker: kode_satker,
      } = await KemenkeuService.getProfilHris2({ nip });

      if (!kode_satker || !name || !jabatan) {
        throw new ExternalServiceError("KemenkeuService", "Data HRIS Tidak Lengkap");
      }
      const jabatanDefinitif = jabatan.find((j) => j.statusJabatan == "Definitif");
      if (!jabatanDefinitif) {
        throw new ExternalServiceError("KemenkeuService", "Data Jabatan Definitif tidak ditemukan");
      }

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
      const viewGaji = await ViewGaji.findOne({
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

      const pdf = await PdfService.DaftarGaji({
        satker: satker,
        gaji: gaji,
        profil: profil,
        bulan: dataBulan,
        viewGaji: viewGaji,
        tahun: tahun,
        nama: name,
        nip: nip,
        jabatan: jabatanDefinitif.namaJabatan,
        nomor: `${Number(dataNomor.no_urut_daftar)}${dataNomor.ext_daftar}`,
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
          jenis: "daftar-gaji",
          nomor: `${Number(dataNomor.no_urut_daftar)}/${dataNomor.ext_daftar}/${current_tahun}`,
          tanggal: Math.round(Date.now() / 1000),
          tujuan: name,
          perihal: `Daftar Gaji Bulan ${dataBulan.bulan} Tahun ${tahun}`,
          file: filename,
          status: 0,
        },
        {
          transaction: t,
        }
      );

      dataNomor.no_urut_daftar = `${Number(dataNomor.no_urut_daftar) + 1}`;
      await dataNomor.save({ transaction: t });
      await AlikaService.sendPushNotification({
        nip: profil.nip_ttd_skp,
        message: `${name} mengirimkan permohonan Daftar Gaji Bulan ${dataBulan.bulan} Tahun ${tahun}`,
      });
      await AlikaService.sendPushNotification({
        nip: nip,
        message: `Permohonan Daftar Gaji Bulan ${dataBulan.bulan} Tahun ${tahun} sedang diproses oleh ${profil.nama_ttd_skp}.`,
      });

      successResponse(res, "Permohonan berhasil di kirim.");
    },
    {
      useTransaction: true,
    }
  ),
};
