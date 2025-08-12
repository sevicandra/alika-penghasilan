import { AuthenticatedRequest } from "@/types/auth";
import { Response } from "express";
import { errorResponse } from "@/helpers/respose.helper";
import { DataCetak, sequelize } from "@/models";
import {
  ValidationError,
  DatabaseError,
  ConnectionError,
  UniqueConstraintError,
} from "sequelize";
import { AxiosError } from "axios";
import { MinioService } from "@/services/minio.service";
import { AlikaService } from "@/services/alika.service";
import { EsignService } from "@/services/esign.service";
const minioService = new MinioService();

export const processTte = async (req: AuthenticatedRequest, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id, Passphrase } = req.body;
    const { nip, nik } = req.user || {};
    if (!id || !Passphrase || !nip || !nik)
      throw new Error("Parameter Tidak Lengkap");
    const dataCetak = await DataCetak.findByPk(id);
    if (!dataCetak) throw new Error("File Tidak Ditemukan");
    if (dataCetak?.status === 1) throw new Error("File Sudah Ditandatangani");
    if (dataCetak?.status != 0) throw new Error("File Sudah Ditolak");
    if (dataCetak.nip_tujuan !== nip) throw new Error("unauthorized");
    if (dataCetak.jenis.toUpperCase() === "KP4S")
      throw new Error("File tidak dapat ditandatangani");
    if (!Passphrase) throw new Error("Passphrase harus diisi");

    const stream = await minioService.downloadFile(dataCetak.file);
    if (!stream) throw new Error("File tidak ditemukan");

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const blob = new Blob([Buffer.concat(chunks)], { type: "application/pdf" });

    const tte = await EsignService.processEsign({
      nik,
      Passphrase,
      jenis: dataCetak.jenis,
      nomor: dataCetak.nomor,
      tujuan: dataCetak.tujuan,
      perihal: dataCetak.perihal,
      id: dataCetak.id,
      blob,
      fileName: dataCetak.file,
      tag_koordinat: `$`,
    });
    minioService.uploadFile(tte.buffer, dataCetak.file);

    await dataCetak.update(
      {
        status: 1,
        date: tte.date as string,
        id_dokumen: tte.id_dokumen as string,
      },
      {
        transaction: t,
      }
    );
    AlikaService.sendPushNotification({
      nip: dataCetak.nip_asal,
      message: `Permohonan TTE ${dataCetak.jenis} telah ditandatangani oleh ${dataCetak.nama_tujuan}`,
    });
    await t.commit();
    return res.status(200).json({ message: "success" });
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
export const processTteKp4s = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const t = await sequelize.transaction();
  try {
    const { id, Passphrase } = req.body;
    const { nip, nik } = req.user || {};
    if (!id || !Passphrase || !nip || !nik)
      throw new Error("Parameter Tidak Lengkap");
    const dataCetak = await DataCetak.findByPk(id);
    if (!dataCetak) throw new Error("File Tidak Ditemukan");
    if (dataCetak?.status === 1) throw new Error("File Sudah Ditandatangani");
    if (dataCetak?.status != 0) throw new Error("File Sudah Ditolak");
    if (dataCetak.nip_tujuan !== nip) throw new Error("unauthorized");
    if (dataCetak.jenis.toUpperCase() != "KP4S")
      throw new Error("File tidak dapat ditandatangani");
    if (!Passphrase) throw new Error("Passphrase harus diisi");
    const stream = await minioService.downloadFile(dataCetak.file);
    if (!stream) throw new Error("File tidak ditemukan");

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const blob = new Blob([Buffer.concat(chunks)], { type: "application/pdf" });
    const tte = await EsignService.processEsign({
      nik,
      Passphrase,
      jenis: dataCetak.jenis,
      nomor: dataCetak.nomor,
      tujuan: dataCetak.tujuan,
      perihal: dataCetak.perihal,
      id: dataCetak.id,
      blob,
      fileName: dataCetak.file,
      tag_koordinat: `#`,
    });
    await minioService.uploadFile(tte.buffer, dataCetak.file);
    const tujuan = dataCetak.tujuan.split("/");
    await dataCetak.update(
      {
        nip_tujuan: tujuan[1],
        nama_tujuan: tujuan[0],
        tujuan: dataCetak.nama_tujuan,
        jenis: "KP4",
      },
      {
        transaction: t,
      }
    );
    await AlikaService.sendPushNotification({
      nip: tujuan[1],
      message: `${dataCetak.tujuan} mengirimkan permohonan KP4`,
    });
    await AlikaService.sendPushNotification({
      nip: nip,
      message: `Permohonan KP4 sedang diproses oleh ${tujuan[0]}.`,
    });
    await t.commit();
    return res.status(200).json({ message: "success" });
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
