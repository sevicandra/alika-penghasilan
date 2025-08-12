import { AuthenticatedRequest } from "@/types/auth";
import { Response } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { KemenkeuService } from "@/services/kemenkeu.service";
import { PdfService } from "@/services/pdf.service";
import {
  DataProfil,
  DataSatker,
  DataNomor,
  DataCetak,
  DataGaji,
  sequelize,
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

const minioService = new MinioService();
export const previewKP4 = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { nip, kdsatker } = req.body;
    if (!nip || !kdsatker)
      return errorResponse(res, "Parameter Tidak Lengkap", 400);
    const ClientProfile = await KemenkeuService.getProfilHris2({ nip });
    const keluarga = await KemenkeuService.getKeluarga({ nip });
    const {
      tempatLahir: tempatLahir,
      tanggalLahir: tanggalLahir,
      jabatan: jabatan,
      nama: name,
      namaSatker: namaSatker,
      pangkat: pangkat,
      kdSatker: kode_satker,
    } = ClientProfile;
    if (kode_satker != kdsatker) return errorResponse(res, "Forbidden", 403);
    keluarga.sort(
      (a: any, b: any) =>
        new Date(a.TanggalLahir).getTime() - new Date(b.TanggalLahir).getTime()
    );
    if (
      !tempatLahir ||
      !tanggalLahir ||
      !jabatan ||
      !name ||
      !namaSatker ||
      !pangkat ||
      !kode_satker
    )
      return errorResponse(res, "Data HRIS Tidak Lengkap", 400);
    const satker = await DataSatker.findOne({
      where: { kdsatker: kode_satker },
    });
    if (!satker) return errorResponse(res, "Data Satker Tidak Ditemukan", 400);
    const profil = await DataProfil.findOne({
      where: {
        kdsatker: kode_satker,
        tahun: new Date().getFullYear(),
      },
    });
    if (!profil)
      return errorResponse(res, "Data Penandatangan Tidak Ditemukan", 400);
    const dataGaji = await DataGaji.findOne({
      where: { nip: nip, bulan: { [Op.lte]: 12 } },
      order: [
        ["tahun", "DESC"],
        ["bulan", "DESC"],
      ],
    });
    if (!dataGaji) return errorResponse(res, "Data Gaji Tidak Ditemukan", 400);
    const pdf = await PdfService.KP4({
      keluargas: keluarga,
      gaji: dataGaji,
      nip: nip as string,
      nama: name,
      tempatLahir: tempatLahir,
      tanggalLahir: tanggalLahir,
      jabatan:
        jabatan.find((x) => x.statusJabatan == "Definitif")?.namaJabatan || "",
      namaSatker: namaSatker,
      golongan: `${pangkat.namaPangkat} / ${pangkat.kodeGolongan}`,
      profil: profil,
      satker: satker,
    });
    const pdfBuffer = Buffer.from(pdf, "base64");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="KP4-${name}.pdf"`);
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
export const cetakKP4 = async (req: AuthenticatedRequest, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { nip, kdsatker } = req.body;
    if (!nip || !kdsatker)
      return errorResponse(res, "Parameter Tidak Lengkap", 400);
    const ClientProfile = await KemenkeuService.getProfilHris2({ nip });
    const keluarga = await KemenkeuService.getKeluarga({ nip });
    const {
      tempatLahir: tempatLahir,
      tanggalLahir: tanggalLahir,
      jabatan: jabatan,
      nama: name,
      namaSatker: namaSatker,
      pangkat: pangkat,
      kdSatker: kode_satker,
    } = ClientProfile;
    if (kode_satker != kdsatker) return errorResponse(res, "Forbidden", 403);
    keluarga.sort(
      (a: any, b: any) =>
        new Date(a.TanggalLahir).getTime() - new Date(b.TanggalLahir).getTime()
    );
    if (
      !tempatLahir ||
      !tanggalLahir ||
      !jabatan ||
      !name ||
      !namaSatker ||
      !pangkat ||
      !kode_satker
    )
      return errorResponse(res, "Data HRIS Tidak Lengkap", 400);
    const satker = await DataSatker.findOne({
      where: { kdsatker: kode_satker },
    });
    if (!satker) return errorResponse(res, "Data Satker Tidak Ditemukan", 400);
    const profil = await DataProfil.findOne({
      where: {
        kdsatker: kode_satker,
        tahun: new Date().getFullYear(),
      },
    });
    if (!profil)
      return errorResponse(res, "Data Penandatangan Tidak Ditemukan", 400);
    const dataGaji = await DataGaji.findOne({
      where: { nip: nip, bulan: { [Op.lte]: 12 } },
      order: [
        ["tahun", "DESC"],
        ["bulan", "DESC"],
      ],
    });
    if (!dataGaji) return errorResponse(res, "Data Gaji Tidak Ditemukan", 400);
    const dataNomor = await DataNomor.findOne({
      where: {
        tahun: new Date().getFullYear(),
        kdsatker: kode_satker,
      },
    });
    if (!dataNomor)
      return errorResponse(res, "Data Penomoran Tidak Ditemukan", 400);
    const pdf = await PdfService.KP4({
      keluargas: keluarga,
      gaji: dataGaji,
      nip: nip,
      nama: name,
      tempatLahir: tempatLahir,
      tanggalLahir: tanggalLahir,
      jabatan:
        jabatan.find((x) => x.statusJabatan == "Definitif")?.namaJabatan || "",
      namaSatker: namaSatker,
      golongan: `${pangkat.namaPangkat} / ${pangkat.kodeGolongan}`,
      profil: profil,
      satker: satker,
    });
    const pdfBuffer = Buffer.from(pdf, "base64");
    const filename = `${uuid()}-${Date.now()}.pdf`;
    await minioService.uploadFile(pdfBuffer, filename);
    await DataCetak.create(
      {
        tahun: new Date().getFullYear().toString(),
        nip_asal: nip,
        nip_tujuan: nip,
        nama_tujuan: name,
        jenis: "KP4S",
        nomor: `${Number(dataNomor.no_urut_kp4)}${dataNomor.ext_kp4}`,
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
    await dataNomor.update(
      {
        no_urut_kp4: `${Number(dataNomor.no_urut_kp4) + 1}`,
      },
      {
        transaction: t,
      }
    );
    return successResponse(res, "Cetak KP4 Berhasil", null, 200);
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
