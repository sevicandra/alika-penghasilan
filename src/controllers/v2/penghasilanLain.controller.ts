import { AuthenticatedRequest } from "@/types/auth";
import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { DataLain } from "@/models";
import sequelize from "@/config/db.config";

export const getAllPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || 0;
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const where: any = { nip: nip };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (jenis) where.jenis = jenis;
    const order: any[] = [];
    const sortField = (req.query.sortField as string) || "id";
    const sortOrder = (req.query.sortOrder as string) || "DESC";
    order.push([sortField, sortOrder.toUpperCase()]);
    const { count, rows: data } = await DataLain.findAndCountAll({
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

    return successResponse(res, "success get all data penghasilan lain", data, {
      limit,
      offset,
      count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
    });
  } catch (error: unknown) {
    next(error);
  }
};
export const countAllPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const where: any = {
      nip: nip,
    };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (jenis) where.jenis = jenis;
    const count = await DataLain.count({
      where,
    });
    return successResponse(
      res,
      "Success count all data penghasilan lain",
      count
    );
  } catch (error: unknown) {
    next(error);
  }
};
export const getTahunPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const jenis = (req.query.jenis as string) || undefined;
    const where: any = {
      nip: nip,
    };
    if (jenis) where.jenis = jenis;
    const result = await DataLain.findAll({
      where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return successResponse(res, "Success get tahun penghasilan lain", result);
  } catch (error: unknown) {
    next(error);
  }
};
export const getBulanPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const tahun = parseInt(req.params.tahun);
    if (!tahun || isNaN(tahun)) {
      return errorResponse(res, "Tahun tidak valid", null, 422);
    }
    const jenis = (req.query.jenis as string) || undefined;
    const where: any = {
      tahun: tahun,
      nip: nip,
    };
    if (jenis) where.jenis = jenis;
    const result = await DataLain.findAll({
      where,
      attributes: ["bulan"],
      group: ["bulan"],
      order: [["bulan", "DESC"]],
    });
    return successResponse(res, "Success get bulan penghasilan lain", result);
  } catch (error: unknown) {
    next(error);
  }
};
export const getJenisPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const where: any = {
      nip: nip,
    };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    const data = await DataLain.findAll({
      where,
      attributes: ["jenis"],
      group: ["jenis"],
      order: [["jenis", "DESC"]],
    });
    return successResponse(res, "Success get jenis penghasilan lain", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const getPenghasilanLainById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const id = parseInt(req.params.id);
    const data = await DataLain.findOne({ where: { id } });
    if (!data || data.nip !== nip) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "Success get data penghasilan lain", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const getRekapPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const tahun = (req.query.tahun as string) || undefined;
    const where: any = {
      nip: nip,
    };
    if (tahun) where.tahun = tahun;
    const data = await DataLain.scope("rekap").findAll({
      where,
    });
    return successResponse(res, "Success get rekap penghasilan lain", data);
  } catch (error: unknown) {
    next(error);
  }
};
