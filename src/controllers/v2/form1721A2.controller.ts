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
  DataNomor,
  DataProfil,
  DataSatker,
  DataSptPegawai,
  RefSptTahunan,
  ViewPajakGaji,
  ViewPajakKurang,
  ViewTukin,
} from "@/repositories";

export const SPTControllerV2 = {
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
      const {
        nama: name,
        jabatan: jabatan,
        npwp: npwp,
        nik: nik,
        pangkat: pangkat,
      } = await KemenkeuService.getProfilHris2({ nip });

      if (!name || !jabatan || !npwp || !nik || !pangkat) {
        throw new ExternalServiceError("KemenkeuService", "Data HRIS Tidak Lengkap");
      }
      const jabatanDefinitif = jabatan.find((j) => j.statusJabatan == "Definitif");
      if (!jabatanDefinitif) {
        throw new ExternalServiceError("KemenkeuService", "Data Jabatan Definitif tidak ditemukan");
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
      const tarif = await RefSptTahunan.findOne({ where: { tahun: tahun } });
      if (!tarif) {
        throw new NotFoundError("Referensi Tarif Pajak Tidak Ditemukan");
      }
      const viewGaji = await ViewPajakGaji.findOne({
        where: {
          nip: nip,
          tahun: tahun,
        },
      });
      const viewKurang = await ViewPajakKurang.findOne({
        where: {
          nip: nip,
          tahun: tahun,
        },
      });
      const viewTukin = await ViewTukin.findAll({
        where: {
          nip: nip,
          tahun: tahun,
        },
      });

      const pdf = await PdfService.Form1721A2({
        pegawai: pegawai,
        satker: satker,
        profil: profil,
        gaji: viewGaji,
        kurang: viewKurang,
        tukin: viewTukin,
        tarif: tarif,
        tahun: tahun,
        nama: name,
        nip: nip,
        jabatan: jabatanDefinitif.namaJabatan,
        npwp: npwp,
        nik: nik,
        golongan: `${pangkat.namaPangkat} / ${pangkat.kodeGolongan}`,
      });

      const pdfBuffer = Buffer.from(pdf, "base64");

      fileResponse(
        res,
        pdfBuffer,
        `Form 1721-A2 Tahun ${tahun} - ${name}_${nip}.pdf`,
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
      const {
        nama: name,
        jabatan: jabatan,
        npwp: npwp,
        nik: nik,
        pangkat: pangkat,
      } = await KemenkeuService.getProfilHris2({ nip });

      if (!name || !jabatan || !npwp || !nik || !pangkat) {
        throw new ExternalServiceError("KemenkeuService", "Data HRIS Tidak Lengkap");
      }
      const jabatanDefinitif = jabatan.find((j) => j.statusJabatan == "Definitif");
      if (!jabatanDefinitif) {
        throw new ExternalServiceError("KemenkeuService", "Data Jabatan Definitif tidak ditemukan");
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
      const tarif = await RefSptTahunan.findOne({ where: { tahun: tahun } });
      if (!tarif) {
        throw new NotFoundError("Referensi Tarif Pajak Tidak Ditemukan");
      }
      const viewGaji = await ViewPajakGaji.findOne({
        where: {
          nip: nip,
          tahun: tahun,
        },
      });
      const viewKurang = await ViewPajakKurang.findOne({
        where: {
          nip: nip,
          tahun: tahun,
        },
      });
      const viewTukin = await ViewTukin.findAll({
        where: {
          nip: nip,
          tahun: tahun,
        },
      });

      const dataNomor = await DataNomor.getNomor(pegawai.kdsatker, current_tahun, t);

      const pdf = await PdfService.Form1721A2({
        pegawai: pegawai,
        satker: satker,
        profil: profil,
        gaji: viewGaji,
        kurang: viewKurang,
        tukin: viewTukin,
        tarif: tarif,
        tahun: tahun,
        nama: name,
        nip: nip,
        jabatan: jabatanDefinitif.namaJabatan,
        npwp: npwp,
        nik: nik,
        golongan: `${pangkat.namaPangkat} / ${pangkat.kodeGolongan}`,
        nomor: `${Number(dataNomor.no_urut_pph)}/${dataNomor.ext_pph}/${current_tahun}`,
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
          nip_tujuan: profil.nip_ttd_skp,
          nama_tujuan: profil.nama_ttd_skp,
          jenis: "pph",
          nomor: `${Number(dataNomor.no_urut_pph)}/${dataNomor.ext_pph}/${current_tahun}`,
          tanggal: Math.round(Date.now() / 1000),
          tujuan: name,
          perihal: `Bukti Potong PPh Pasal 21 Tahun ${tahun}`,
          file: filename,
          status: 0,
        },
        {
          transaction: t,
        }
      );

      dataNomor.no_urut_pph = `${Number(dataNomor.no_urut_pph) + 1}`;
      await dataNomor.save({ transaction: t });
      await AlikaService.sendPushNotification({
        nip: profil.nip_bendahara,
        message: `${name} mengirimkan permohonan Bukti Potong PPh Pasal 21 Tahun ${tahun}`,
      });
      await AlikaService.sendPushNotification({
        nip: nip,
        message: `Permohonan Bukti Potong PPh Pasal 21 Tahun ${tahun} sedang diproses oleh bendahara.`,
      });

      successResponse(res, "Permohonan berhasil di kirim.");
    },
    {
      useTransaction: true,
    }
  ),
};
