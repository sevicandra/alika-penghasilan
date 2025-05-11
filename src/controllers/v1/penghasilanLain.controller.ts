import { AuthenticatedRequest } from "@/types/auth";
import { Response } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { DataLain } from "@/models";
import {
  ValidationError,
  DatabaseError,
  ConnectionError,
  UniqueConstraintError,
} from "sequelize";
import { AxiosError } from "axios";
import { parse } from "csv-parse";

export const getAllPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || 0;
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    if (jenis) where.jenis = jenis;
    if (kdsatker) where.kdsatker = kdsatker;
    const order: any[] = [];
    const sortField = (req.query.sortField as string) || "id";
    const sortOrder = (req.query.sortOrder as string) || "DESC";
    order.push([sortField, sortOrder.toUpperCase()]);
    const data = await DataLain.findAll({
      where,
      order,
      limit,
      offset,
    });
    const count = await DataLain.count({ where });
    return successResponse(res, "success get all data penghasilan lain", data, {
      limit,
      offset,
      count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
    });
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
export const countAllPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    if (jenis) where.jenis = jenis;
    if (kdsatker) where.kdsatker = kdsatker;
    const count = await DataLain.count({
      where,
    });
    return successResponse(
      res,
      "Success count all data penghasilan lain",
      count
    );
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
export const getTahunPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const nip = (req.query.nip as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {};
    if (nip) where.nip = nip;
    if (jenis) where.jenis = jenis;
    if (kdsatker) where.kdsatker = kdsatker;
    const result = await DataLain.findAll({
      where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return successResponse(res, "Success get tahun penghasilan lain", result);
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
export const getBulanPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const tahun = parseInt(req.params.tahun);
    if (!tahun || isNaN(tahun)) {
      return errorResponse(res, "Tahun tidak valid", null, 422);
    }
    const nip = (req.query.nip as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {
      tahun: tahun,
    };
    if (nip) where.nip = nip;
    if (jenis) where.jenis = jenis;
    if (kdsatker) where.kdsatker = kdsatker;
    const result = await DataLain.findAll({
      where,
      attributes: ["bulan"],
      group: ["bulan"],
      order: [["bulan", "DESC"]],
    });
    return successResponse(res, "Success get bulan penghasilan lain", result);
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
export const getJenisPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    if (kdsatker) where.kdsatker = kdsatker;
    const data = await DataLain.findAll({
      where,
      attributes: ["jenis"],
      group: ["jenis"],
      order: [["jenis", "DESC"]],
    });
    return successResponse(res, "Success get jenis penghasilan lain", data);
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
export const getPenghasilanLainById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataLain.findOne({ where: { id } });
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "Success get data penghasilan lain", data);
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
export const createPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      bulan,
      tahun,
      kdsatker,
      nip,
      bruto,
      pph,
      netto,
      jenis,
      uraian,
      tanggal,
      nospm,
    } = req.body;
    const data = await DataLain.create({
      bulan: bulan,
      tahun: tahun,
      kdsatker: kdsatker,
      nip: nip,
      bruto: parseInt(bruto),
      pph: parseInt(pph),
      netto: parseInt(netto),
      jenis: jenis,
      uraian: uraian,
      tanggal: +new Date(tanggal) / 1000,
      nospm: nospm,
    });
    return successResponse(
      res,
      "Success create data penghasilan lain",
      data,
      null,
      201
    );
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
export const importCsvPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.file) {
      return errorResponse(res, "File tidak ditemukan", null, 400);
    }
    const csvBuffer = req.file.buffer;
    const records: {
      bulan: string;
      tahun: string;
      kdsatker: string;
      nip: string;
      bruto: number;
      pph: number;
      netto: number;
      jenis: string;
      uraian: string;
      tanggal: number;
      nospm: string | null;
    }[] = [];

    const parser = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ";",
    });
    for await (const record of parser) {
      records.push(record);
    }

    const invalid = records.find(
      (r) => !r.nip || !r.tahun || !r.bulan || !r.kdsatker || !r.jenis
    );
    if (invalid) {
      return errorResponse(res, "Data tidak valid", invalid, 400);
    }
    await DataLain.bulkCreate(records);
    return successResponse(
      res,
      "Data penghasilan lain berhasil ditambahkan",
      null,
      null,
      201
    );
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
export const updatePenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const {
      bulan,
      tahun,
      kdsatker,
      nip,
      bruto,
      pph,
      netto,
      jenis,
      uraian,
      tanggal,
      nospm,
    } = req.body;
    const data = await DataLain.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    if (bulan) data.bulan = bulan;
    if (tahun) data.tahun = tahun;
    if (kdsatker) data.kdsatker = kdsatker;
    if (nip) data.nip = nip;
    if (bruto) data.bruto = bruto;
    if (pph) data.pph = pph;
    if (netto) data.netto = netto;
    if (jenis) data.jenis = jenis;
    if (uraian) data.uraian = uraian;
    if (tanggal) data.tanggal = +new Date(tanggal) / 1000;
    if (nospm) data.nospm = nospm;
    await data.save();
    await data.reload();
    return successResponse(res, "Data penghasilan lain berhasil diubah", data);
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
export const hapusPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataLain.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    await data.destroy();
    return successResponse(res, "Data penghasilan lain berhasil dihapus", {
      id,
    });
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

// try {
// }  catch (error: unknown) {
//   if (
//     error instanceof ValidationError ||
//     error instanceof UniqueConstraintError
//   ) {
//     const parsedErrors = error.errors.map((err) => ({
//       field: err.path,
//       message: err.message,
//     }));
//     return errorResponse(res, "Validation gagal", parsedErrors, 422);
//   } else if (
//     error instanceof DatabaseError ||
//     error instanceof ConnectionError
//   ) {
//     const parsedErrors = error.message;
//     return errorResponse(res, "Kesalahan pada database", parsedErrors, 500);
//   } else if (error instanceof ConnectionError) {
//     const parsedErrors = { message: "Gagal terhubung ke database" };
//     return errorResponse(res, "Koneksi ke database gagal", parsedErrors, 503);
//   } else if(error instanceof AxiosError){
//     if (typeof error === "object" && error !== null && "isAxiosError" in error && (error as AxiosError).isAxiosError) {
//       const axiosError = error as AxiosError;
//       const statusCode = axiosError.response?.status || 500;
//       const message = (axiosError.response?.data as { message?: string })?.message || axiosError.message || "Kesalahan pada permintaan eksternal";
//       const details = axiosError.response?.data || null;
//       return errorResponse(res, message, details, statusCode);
//     }
//     return errorResponse(res, "Terjadi kesalahan", null, 500);
//   } else if (error instanceof Error) {
//     const parsedErrors = { message: error.message };
//     return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
//   } else {
//     const parsedErrors = { message: "Kesalahan tidak diketahui" };
//     return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
//   }
// }
