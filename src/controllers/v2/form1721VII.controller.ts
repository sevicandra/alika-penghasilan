import { AuthenticatedRequest } from "@/types/auth";
import { Response } from "express";
import { errorResponse } from "@/helpers/respose.helper";
import { KemenkeuService } from "@/services/kemenkeu.service";
import { PdfService } from "@/services/pdf.service";
import {
  DataSptPegawai,
  DataProfil,
  DataSatker,
  DataNomor,
  DataCetak,
  DataMakan,
  DataLembur,
  DataLain,
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
import sequelize from "@/config/db.config";

const minioService = new MinioService();

export const previewForm1721VII = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const { tahun } = req.body;
    if (!tahun) return errorResponse(res, "Parameter Tidak Lengkap", 400);
    const ClientProfile = await KemenkeuService.getProfil({ nip });
    const { Nama: name } = ClientProfile;
    if (!name) return errorResponse(res, "Parameter HRIS Tidak Lengkap", 400);
    const pegawai = await DataSptPegawai.findOne({
      where: {
        nip: nip,
        tahun: tahun,
      },
    });
    if (!pegawai)
      return errorResponse(res, "Data Pegawai Tidak Ditemukan", 400);
    const profil = await DataProfil.findOne({
      where: {
        kdsatker: pegawai.kdsatker,
        tahun: tahun,
      },
    });
    if (!profil)
      return errorResponse(res, "Data Penandatangan Tidak Ditemukan", 400);
    const satker = await DataSatker.findOne({
      where: { kdsatker: pegawai.kdsatker },
    });
    if (!satker) return errorResponse(res, "Data Satker Tidak Ditemukan", 400);
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
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="FormVII-${name}.pdf"`
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

export const cetakForm1721VII = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const { tahun } = req.body;
    if (!tahun) return errorResponse(res, "Parameter Tidak Lengkap", 400);
    const ClientProfile = await KemenkeuService.getProfil({ nip });
    const { Nama: name } = ClientProfile;
    if (!name) return errorResponse(res, "Parameter HRIS Tidak Lengkap", 400);
    const pegawai = await DataSptPegawai.findOne({
      where: {
        nip: nip,
        tahun: tahun,
      },
    });
    if (!pegawai)
      return errorResponse(res, "Data Pegawai Tidak Ditemukan", 400);
    const profil = await DataProfil.findOne({
      where: {
        kdsatker: pegawai.kdsatker,
        tahun: tahun,
      },
    });
    if (!profil)
      return errorResponse(res, "Data Penandatangan Tidak Ditemukan", 400);
    const satker = await DataSatker.findOne({
      where: { kdsatker: pegawai.kdsatker },
    });
    if (!satker) return errorResponse(res, "Data Satker Tidak Ditemukan", 400);
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
    const dataNomor = await DataNomor.findOne({
      where: {
        tahun: new Date().getFullYear(),
        kdsatker: pegawai.kdsatker,
      },
    });
    if (!dataNomor)
      return errorResponse(res, "Data Penomoran Tidak Ditemukan", 400);
    const pdf = await PdfService.Form1721VII({
      pegawai: pegawai,
      satker: satker,
      profil: profil,
      makan: dataMakan,
      lembur: dataLembur,
      lains: dataLains,
      nama: name,
      nip: nip,
      nomor: `${Number(dataNomor.no_urut_final)}${dataNomor.ext_final}`,
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    });
    const pdfBuffer = Buffer.from(pdf, "base64");
    const filename = `${uuid()}-${Date.now()}.pdf`;
    await minioService.uploadFile(pdfBuffer, filename);
    await DataCetak.create({
      tahun: new Date().getFullYear().toString(),
      nip_asal: nip,
      nip_tujuan: profil.nip_bendahara,
      nama_tujuan: profil.nama_bendahara,
      jenis: "pph-final",
      nomor: `${Number(dataNomor.no_urut_final)}${dataNomor.ext_final}`,
      tanggal: Math.round(Date.now() / 1000),
      tujuan: name,
      perihal: `Bukti Potong PPh Pasal 21 Final Tahun ${tahun}`,
      file: filename,
      status: 0,
    });
    await dataNomor.update({
      no_urut_final: `${Number(dataNomor.no_urut_final) + 1}`,
    });
    await AlikaService.sendPushNotification({
      nip: profil.nip_bendahara,
      message: `${name} mengirimkan permohonan Bukti Potong PPh Pasal 21 Final Tahun ${tahun}`,
    });
    await AlikaService.sendPushNotification({
      nip: nip,
      message: `Permohonan Bukti Potong PPh Pasal 21 Final Tahun ${tahun} sedang diproses oleh bendahara.`,
    });
    return res.status(200).json({ message: "Permohonan berhasil di kirim." });
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
