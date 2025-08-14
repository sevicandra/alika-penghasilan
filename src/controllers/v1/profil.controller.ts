import { AuthenticatedRequest } from "@/types/auth";
import { Response } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { DataProfil } from "@/models";
import {
  ValidationError,
  DatabaseError,
  ConnectionError,
  UniqueConstraintError,
} from "sequelize";
import { AxiosError } from "axios";

export const getAllProfil = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || 0;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const where: any = {};

    if (kdsatker) where.kdsatker = kdsatker;
    if (tahun) where.tahun = tahun;
    const order: any[] = [];
    const sortField = (req.query.sortField as string) || "id";
    const sortOrder = (req.query.sortOrder as string) || "DESC";
    order.push([sortField, sortOrder.toUpperCase()]);
    const data = await DataProfil.findAll({
      where,
      order,
      limit,
      offset,
    });
    const count = await DataProfil.count({ where });
    return successResponse(res, "success get data profil", data, {
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
export const countAllProfil = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const where: any = {};
    if (kdsatker) where.kdsatker = kdsatker;
    if (tahun) where.tahun = tahun;
    const count = await DataProfil.count({
      where,
    });
    return successResponse(res, "Success count all data profil", count);
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
export const getProfilById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataProfil.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "Success get data profil", data);
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
export const createProfil = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      tahun,
      kdsatker,
      no_skp,
      nama_ttd_skp,
      nip_ttd_skp,
      jab_ttd_skp,
      nama_ttd_kp4,
      nip_ttd_kp4,
      jab_ttd_kp4,
      npwp_bendahara,
      nama_bendahara,
      nip_bendahara,
      tgl_spt,
      file,
    } = req.body;
    const data = await DataProfil.create({
      tahun: tahun,
      kdsatker: kdsatker,
      no_skp: no_skp,
      nama_ttd_skp: nama_ttd_skp,
      nip_ttd_skp: nip_ttd_skp,
      jab_ttd_skp: jab_ttd_skp,
      nama_ttd_kp4: nama_ttd_kp4,
      nip_ttd_kp4: nip_ttd_kp4,
      jab_ttd_kp4: jab_ttd_kp4,
      npwp_bendahara: npwp_bendahara,
      nama_bendahara: nama_bendahara,
      nip_bendahara: nip_bendahara,
      tgl_spt: +new Date(tgl_spt) / 1000,
      file: file,
    });
    return successResponse(res, "Success create data profil", data);
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
export const updateProfil = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const {
      tahun,
      kdsatker,
      no_skp,
      nama_ttd_skp,
      nip_ttd_skp,
      jab_ttd_skp,
      nama_ttd_kp4,
      nip_ttd_kp4,
      jab_ttd_kp4,
      npwp_bendahara,
      nama_bendahara,
      nip_bendahara,
      tgl_spt,
      file,
    } = req.body;
    const data = await DataProfil.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    if (tahun) data.tahun = tahun;
    if (kdsatker) data.kdsatker = kdsatker;
    if (no_skp) data.no_skp = no_skp;
    if (nama_ttd_skp) data.nama_ttd_skp = nama_ttd_skp;
    if (nip_ttd_skp) data.nip_ttd_skp = nip_ttd_skp;
    if (jab_ttd_skp) data.jab_ttd_skp = jab_ttd_skp;
    if (nama_ttd_kp4) data.nama_ttd_kp4 = nama_ttd_kp4;
    if (nip_ttd_kp4) data.nip_ttd_kp4 = nip_ttd_kp4;
    if (jab_ttd_kp4) data.jab_ttd_kp4 = jab_ttd_kp4;
    if (npwp_bendahara) data.npwp_bendahara = npwp_bendahara;
    if (nama_bendahara) data.nama_bendahara = nama_bendahara;
    if (nip_bendahara) data.nip_bendahara = nip_bendahara;
    if (tgl_spt) data.tgl_spt = +new Date(tgl_spt) / 1000;
    if (file) data.file = file;
    await data.save();
    await data.reload();
    return successResponse(res, "Success update data profil", data);
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
export const hapusProfil = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataProfil.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    await data.destroy();
    return successResponse(res, "Data profil berhasil dihapus", {
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