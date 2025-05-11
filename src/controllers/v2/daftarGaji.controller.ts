import { AuthenticatedRequest } from "@/types/auth";
import { Response } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { KemenkeuService } from "@/services/kemenkeu.service";
import { PdfService } from "@/services/pdf.service";
import {
  DataSptPegawai,
  DataProfil,
  DataSatker,
  ViewPajakGaji,
  ViewPajakKurang,
  ViewTukin,
  RefSptTahunan,
  DataNomor,
  DataCetak,
  DataMakan,
  DataLembur,
  DataLain,
  DataGaji,
  ViewGaji,
  RefBulan,
} from "@/models";
import {
  Op,
  ValidationError,
  DatabaseError,
  ConnectionError,
  UniqueConstraintError,
} from "sequelize";
import { AxiosError } from "axios";
import { MinioService } from "@/services/minio.service";
import { v4 as uuid } from "uuid";
import { AlikaService } from "@/services/alika.service";
const minioService = new MinioService();
export const previewDaftarGaji = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { nip } = req.user;
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const { bulan, tahun } = req.body;
    if (!bulan || !nip || !tahun)
      return errorResponse(res, "Parameter Tidak Lengkap", 400);
    const ClientProfile = await KemenkeuService.getProfil({ nip });
    const {
      Nama: name,
      Jabatan: jabatan,
      KdSatker: kode_satker,
    } = ClientProfile;
    if (!kode_satker || !name || !jabatan)
      return errorResponse(res, "Data HRIS Tidak Lengkap", 400);
    const satker = await DataSatker.findOne({
      where: { kdsatker: kode_satker },
    });
    if (!satker) return errorResponse(res, "Satker Tidak Ditemukan", 400);
    const profil = await DataProfil.findOne({
      where: {
        kdsatker: kode_satker,
        tahun: new Date().getFullYear(),
      },
    });
    if (!profil)
      return errorResponse(res, "Referensi Penandatangan Tidak Ditemukan", 400);
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
    if (!dataBulan)
      return errorResponse(res, "Referensi Bulan Tidak Ditemukan", 400);
    const pdf = await PdfService.DaftarGaji({
      satker: satker,
      gaji: gaji,
      profil: profil,
      bulan: dataBulan,
      viewGaji: viewGaji,
      tahun: tahun,
      nama: name,
      nip: nip,
      jabatan: jabatan,
    });
    const pdfBuffer = Buffer.from(pdf, "base64");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="Daftar Gaji-${name}.pdf"`
    );
    return res.status(200).send(pdfBuffer);
  } catch (error: unknown) {
    if (
      error instanceof ValidationError ||
      error instanceof UniqueConstraintError
    ) {
      const parsedErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return errorResponse(res, "Validation gagal", parsedErrors, 422);
    } else if (
      error instanceof DatabaseError ||
      error instanceof ConnectionError
    ) {
      const parsedErrors = error.message;
      return errorResponse(res, "Kesalahan pada database", parsedErrors, 500);
    } else if (error instanceof ConnectionError) {
      const parsedErrors = { message: "Gagal terhubung ke database" };
      return errorResponse(res, "Koneksi ke database gagal", parsedErrors, 503);
    } else if (error instanceof AxiosError) {
      if (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error &&
        (error as AxiosError).isAxiosError
      ) {
        const axiosError = error as AxiosError;
        const statusCode = axiosError.response?.status || 500;
        const message =
          (axiosError.response?.data as { message?: string })?.message ||
          axiosError.message ||
          "Kesalahan pada permintaan eksternal";
        const details = axiosError.response?.data || null;
        return errorResponse(res, message, details, statusCode);
      }
      return errorResponse(res, "Terjadi kesalahan", null, 500);
    } else if (error instanceof Error) {
      const parsedErrors = { message: error.message };
      return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
    } else {
      const parsedErrors = { message: "Kesalahan tidak diketahui" };
      return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
    }
  }
};
export const cetakDaftarGaji = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { nip } = req.user;
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const { bulan, tahun } = req.body;
    if (!bulan || !tahun)
      return errorResponse(res, "Parameter Tidak Lengkap", 400);
    const ClientProfile = await KemenkeuService.getProfil({ nip });
    const {
      Nama: name,
      Jabatan: jabatan,
      KdSatker: kode_satker,
    } = ClientProfile;
    if (!kode_satker || !name || !jabatan)
      return errorResponse(res, "Data HRIS Tidak Lengkap", 400);
    const satker = await DataSatker.findOne({
      where: { kdsatker: kode_satker },
    });
    if (!satker) return errorResponse(res, "Satker Tidak Ditemukan", 400);
    const profil = await DataProfil.findOne({
      where: {
        kdsatker: kode_satker,
        tahun: new Date().getFullYear(),
      },
    });
    if (!profil)
      return errorResponse(res, "Referensi Penandatangan Tidak Ditemukan", 400);
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
    if (!dataBulan)
      return errorResponse(res, "Referensi Bulan Tidak Ditemukan", 400);
    const dataNomor = await DataNomor.findOne({
      where: {
        tahun: new Date().getFullYear(),
        kdsatker: kode_satker,
      },
    });
    if (!dataNomor)
      return errorResponse(res, "Data Penomoran Tidak Ditemukan", 400);
    const pdf = await PdfService.DaftarGaji({
      satker: satker,
      gaji: gaji,
      profil: profil,
      bulan: dataBulan,
      viewGaji: viewGaji,
      tahun: tahun,
      nama: name,
      nip: nip,
      jabatan: jabatan,
      nomor: `${Number(dataNomor.no_urut_daftar)}${dataNomor.ext_daftar}`,
    });
    const pdfBuffer = Buffer.from(pdf, "base64");
    const filename = `${uuid()}-${Date.now()}.pdf`;
    await minioService.uploadFile(pdfBuffer, filename);
    await DataCetak.create({
      tahun: new Date().getFullYear().toString(),
      nip_asal: nip,
      nip_tujuan: profil.nip_ttd_skp,
      nama_tujuan: profil.nama_ttd_skp,
      jenis: "daftar-gaji",
      nomor: `${Number(dataNomor.no_urut_daftar)}${dataNomor.ext_daftar}`,
      tanggal: Math.round(Date.now() / 1000),
      tujuan: name,
      perihal: `Daftar Gaji Bulan ${dataBulan.bulan} Tahun ${tahun}`,
      file: filename,
      status: 0,
    });
    await dataNomor.update({
      no_urut_daftar: `${Number(dataNomor.no_urut_daftar) + 1}`,
    });
    await AlikaService.sendPushNotification({
      nip: profil.nip_ttd_skp,
      message: `${name} mengirimkan permohonan Daftar Gaji Bulan ${dataBulan.bulan} Tahun ${tahun}`,
    });
    await AlikaService.sendPushNotification({
      nip: nip,
      message: `Permohonan Daftar Gaji Bulan ${dataBulan.bulan} Tahun ${tahun} sedang diproses oleh ${profil.nama_ttd_skp}.`,
    });
    return successResponse(res, "Permohonan berhasil di kirim.");
  } catch (error: unknown) {
    if (
      error instanceof ValidationError ||
      error instanceof UniqueConstraintError
    ) {
      const parsedErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return errorResponse(res, "Validation gagal", parsedErrors, 422);
    } else if (
      error instanceof DatabaseError ||
      error instanceof ConnectionError
    ) {
      const parsedErrors = error.message;
      return errorResponse(res, "Kesalahan pada database", parsedErrors, 500);
    } else if (error instanceof ConnectionError) {
      const parsedErrors = { message: "Gagal terhubung ke database" };
      return errorResponse(res, "Koneksi ke database gagal", parsedErrors, 503);
    } else if (error instanceof AxiosError) {
      if (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error &&
        (error as AxiosError).isAxiosError
      ) {
        const axiosError = error as AxiosError;
        const statusCode = axiosError.response?.status || 500;
        const message =
          (axiosError.response?.data as { message?: string })?.message ||
          axiosError.message ||
          "Kesalahan pada permintaan eksternal";
        const details = axiosError.response?.data || null;
        return errorResponse(res, message, details, statusCode);
      }
      return errorResponse(res, "Terjadi kesalahan", null, 500);
    } else if (error instanceof Error) {
      const parsedErrors = { message: error.message };
      return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
    } else {
      const parsedErrors = { message: "Kesalahan tidak diketahui" };
      return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
    }
  }
};
