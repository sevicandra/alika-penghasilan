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
  sequelize,
} from "@/models";
import {
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
export const previewForm1721A2 = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { tahun, nip, kdsatker } = req.body;
    if (!nip || !tahun || !kdsatker)
      return errorResponse(res, "Parameter Tidak Lengkap", 400);
    const ClientProfile = await KemenkeuService.getProfilHris2({ nip });
    const {
      nama: name,
      jabatan: jabatan,
      npwp: npwp,
      nik: nik,
      pangkat: pangkat,
    } = ClientProfile;
    if (!name || !jabatan || !npwp || !nik || !pangkat)
      return errorResponse(res, "Parameter HRIS Tidak Lengkap", 400);
    const pegawai = await DataSptPegawai.findOne({
      where: {
        nip: nip,
        tahun: tahun,
      },
    });
    if (!pegawai)
      return errorResponse(res, "Data Pegawai Tidak Ditemukan", 400);
    if (pegawai.kdsatker !== kdsatker)
      return errorResponse(res, "Frobidden", 403);
    const profil = await DataProfil.findOne({
      where: {
        kdsatker: pegawai.kdsatker,
        tahun: tahun,
      },
    });
    if (!profil)
      return errorResponse(res, "Data Penandatangan Tidak Ditemukan", 400);
    const satker = await DataSatker.findOne({
      where: {
        kdsatker: pegawai.kdsatker,
      },
    });
    if (!satker) return errorResponse(res, "Data Satker Tidak Ditemukan", 400);
    const tarif = await RefSptTahunan.findOne({ where: { tahun: tahun } });
    if (!tarif) return errorResponse(res, "Tarif Tidak Ditemukan", 400);
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
    const viewTukin = await ViewTukin.findOne({
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
      jabatan:
        jabatan.find((x) => x.statusJabatan == "Definitif")?.namaJabatan || "",
      npwp: npwp,
      nik: nik,
      golongan: `${pangkat.namaPangkat} / ${pangkat.kodeGolongan}`,
    });
    const pdfBuffer = Buffer.from(pdf, "base64");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="FormA2-${name}.pdf"`
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

export const cetakForm1721A2 = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const t = await sequelize.transaction();
  try {
    const { tahun, nip, kdsatker } = req.body;
    if (!nip || !tahun || !kdsatker)
      return errorResponse(res, "Parameter Tidak Lengkap", 400);
    const ClientProfile = await KemenkeuService.getProfilHris2({ nip });
    const {
      nama: name,
      jabatan: jabatan,
      npwp: npwp,
      nik: nik,
      pangkat: pangkat,
    } = ClientProfile;
    if (!name || !jabatan || !nik || !pangkat)
      return errorResponse(res, "Parameter HRIS Tidak Lengkap", 400);
    const pegawai = await DataSptPegawai.findOne({
      where: {
        nip: nip,
        tahun: tahun,
      },
    });
    if (!pegawai)
      return errorResponse(res, "Data Pegawai Tidak Ditemukan", 400);
    if (pegawai.kdsatker !== kdsatker)
      return errorResponse(res, "Forbidden", 403);
    const profil = await DataProfil.findOne({
      where: {
        kdsatker: pegawai.kdsatker,
        tahun: tahun,
      },
    });
    if (!profil)
      return errorResponse(res, "Data Penandatangan Tidak Ditemukan", 400);
    const satker = await DataSatker.findOne({
      where: {
        kdsatker: pegawai.kdsatker,
      },
    });
    if (!satker) return errorResponse(res, "Data Satker Tidak Ditemukan", 400);
    const tarif = await RefSptTahunan.findOne({ where: { tahun: tahun } });
    if (!tarif) return errorResponse(res, "Tarif Tidak Ditemukan", 400);
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
    const viewTukin = await ViewTukin.findOne({
      where: {
        nip: nip,
        tahun: tahun,
      },
    });
    const dataNomor = await DataNomor.findOne({
      where: {
        tahun: new Date().getFullYear(),
        kdsatker: pegawai.kdsatker,
      },
    });
    if (!dataNomor)
      return errorResponse(res, "Data Penomoran Tidak Ditemukan", 400);
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
      jabatan:
        jabatan.find((x) => x.statusJabatan == "Definitif")?.namaJabatan || "",
      npwp: npwp,
      nik: nik,
      golongan: `${pangkat.namaPangkat} / ${pangkat.kodeGolongan}`,
      nomor: `${Number(dataNomor.no_urut_pph)}${dataNomor.ext_pph}`,
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    });
    const pdfBuffer = Buffer.from(pdf, "base64");
    const filename = `${uuid()}-${Date.now()}.pdf`;
    await minioService.uploadFile(pdfBuffer, filename);
    await DataCetak.create(
      {
        tahun: new Date().getFullYear().toString(),
        nip_asal: nip,
        nip_tujuan: profil.nip_bendahara,
        nama_tujuan: profil.nama_bendahara,
        jenis: "pph",
        nomor: `${Number(dataNomor.no_urut_pph)}${dataNomor.ext_pph}`,
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
    await dataNomor.update(
      {
        no_urut_pph: `${Number(dataNomor.no_urut_pph) + 1}`,
      },
      {
        transaction: t,
      }
    );
    await AlikaService.sendPushNotification({
      nip: profil.nip_bendahara,
      message: `${name} mengirimkan permohonan Bukti Potong PPh Pasal 21 Tahun ${tahun}`,
    });
    await AlikaService.sendPushNotification({
      nip: nip,
      message: `Permohonan Bukti Potong PPh Pasal 21 Tahun ${tahun} sedang diproses oleh bendahara.`,
    });
    await t.commit();
    return successResponse(res, "Success", 200);
  } catch (error: unknown) {
    await t.rollback();
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
