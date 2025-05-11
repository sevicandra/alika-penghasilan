import { AuthenticatedRequest } from "@/types/auth";
import { Response } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { DataMakan } from "@/models";
import {
  Op,
  ValidationError,
  DatabaseError,
  ConnectionError,
  UniqueConstraintError,
} from "sequelize";
import { AxiosError } from "axios";
import sequelize from "@/config/db.config";
import { parse } from "csv-parse";

export const getAllUangMakan = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    const order: any[] = [];
    const sortField = (req.query.sortField as string) || "id";
    const sortOrder = (req.query.sortOrder as string) || "DESC";
    order.push([sortField, sortOrder.toUpperCase()]);
    const data = await DataMakan.findAll({
      where,
      order,
      limit,
      offset,
      include: [
        {
          association: "Bulan",
          attributes: [],
        },
      ],
      attributes: {
        include: [[sequelize.col("Bulan.bulan"), "nama_bulan"]],
      },
    });
    const count = await DataMakan.count({
      where,
    });
    return successResponse(res, "Success get all data uang makan", data, {
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
export const countAllUangMakan = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    const count = await DataMakan.count({
      where,
    });
    return successResponse(res, "Success count all data uang lembur", count);
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
export const getTahunUangMakan = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const nip = (req.query.nip as string) || undefined;
    const where: any = {};
    if (nip) where.nip = nip;
    const result = await DataMakan.findAll({
      where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return successResponse(res, "Success get tahun uang lembur", result);
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
export const getBulanUangMakan = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const tahun = parseInt(req.params.tahun);
    if (!tahun || isNaN(tahun)) {
      return errorResponse(res, "Tahun tidak valid", null, 422);
    }
    const nip = (req.query.nip as string) || undefined;
    const where: any = {
      tahun: tahun,
    };
    if (nip) where.nip = nip;
    const result = await DataMakan.findAll({
      where,
      attributes: ["bulan"],
      group: ["bulan"],
      order: [["bulan", "DESC"]],
    });
    return successResponse(res, "Success get bulan uang lembur", result);
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
export const getUangMakanById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataMakan.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "Success get data uang lembur", data);
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
export const createUangMakan = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      bulan,
      tahun,
      kdsatker,
      kdanak,
      kdsubanak,
      nip,
      kdgol,
      jmlhari,
      tarif,
      pph,
      bruto,
      netto,
    } = req.body;
    const data = await DataMakan.create({
      bulan: bulan,
      tahun: tahun,
      kdsatker: kdsatker,
      kdanak: kdanak,
      kdsubanak: kdsubanak,
      nip: nip,
      kdgol: kdgol,
      jmlhari: parseInt(jmlhari),
      tarif: parseInt(tarif),
      pph: parseInt(pph),
      bruto: parseInt(bruto),
      netto: parseInt(netto),
    });
    return successResponse(
      res,
      "Success create data uang makan",
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
export const importCsvUangMakan = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.file) {
      return errorResponse(res, "File tidak ditemukan", null, 400);
    }
    const csvBuffer = req.file.buffer;
    const records: DataMakan[] = [];
    const parser = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ";",
    });
    for await (const record of parser) {
      records.push(record);
    }
    const invalid = records.find((r) => !r.nip || !r.tahun || !r.bulan);
    if (invalid) {
      return errorResponse(res, "Data tidak valid", invalid, 422);
    }
    await DataMakan.bulkCreate(records);
    return successResponse(
      res,
      "Data uang makan berhasil ditambahkan",
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
export const updateUangMakan = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const {
      bulan,
      tahun,
      kdsatker,
      kdanak,
      kdsubanak,
      nip,
      kdgol,
      jmlhari,
      tarif,
      pph,
      bruto,
      netto,
    } = req.body;
    const data = await DataMakan.findByPk(id);
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
    if (kdanak) data.kdanak = kdanak;
    if (kdsubanak) data.kdsubanak = kdsubanak;
    if (nip) data.nip = nip;
    if (kdgol) data.kdgol = kdgol;
    if (jmlhari) data.jmlhari = jmlhari;
    if (tarif) data.tarif = tarif;
    if (pph) data.pph = pph;
    if (bruto) data.bruto = bruto;
    if (netto) data.netto = netto;
    await data.save();
    await data.reload();
    return successResponse(res, "Data uang makan berhasil diubah", data, 200);
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
export const hapusUangMakan = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataMakan.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    await data.destroy();
    return successResponse(res, "Data uang makan berhasil dihapus", null, 200);
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
