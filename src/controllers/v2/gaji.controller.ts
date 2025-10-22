import { AuthenticatedRequest } from "@/types/auth";
import { NextFunction, Response } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { DataGaji, ViewGaji } from "@/models";
import sequelize from "@/config/db.config";
export const getAllGaji = async (
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
    const where: any = {
      nip: nip,
    };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    const order: any[] = [];
    const sortField = (req.query.sortField as string) || "id";
    const sortOrder = (req.query.sortOrder as string) || "DESC";
    order.push([sortField, sortOrder.toUpperCase()]);
    const { count, rows: data } = await DataGaji.findAndCountAll({
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
    return successResponse(res, "Success get all data gaji", data, {
      limit,
      offset,
      count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
    });
  } catch (error: unknown) {
    next(error);
  }
};
export const countAllGaji = async (
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
    const count = await DataGaji.count({
      where,
    });
    return successResponse(res, "Success count all data gaji", count);
  } catch (error: unknown) {
    next(error);
  }
};
export const getTahunGaji = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const where: any = {
      nip: nip,
    };
    const data = await DataGaji.findAll({
      where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });

    return successResponse(res, "Success get tahun gaji", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const getBulanGaji = async (
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
    const where: any = {
      tahun: tahun,
      nip: nip,
    };
    if (nip) where.nip = nip;
    const data = await DataGaji.findAll({
      where,
      attributes: ["bulan"],
      group: ["bulan"],
      order: [["bulan", "DESC"]],
    });

    return successResponse(res, "Success get bulan gaji", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const getGajiById = async (
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
    const data = await DataGaji.findByPk(id, {
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
    if (!data || data.nip !== nip) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "Success get data gaji", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const getRekapGaji = async (
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
    const kdjns = req.query.kdjns as string;
    const where: any = {
      nip: nip,
    };
    if (tahun) where.tahun = tahun;
    if (kdjns) where.kdjns = kdjns;
    const data = await ViewGaji.scope("rekap").findOne({
      where,
    });
    return successResponse(res, "Success get data rekap gaji", data);
  } catch (error: unknown) {
    next(error);
  }
};
