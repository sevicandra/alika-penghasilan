import { AuthenticatedRequest } from "@/types/auth";
import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { RefPangkat } from "@/models";
import { Op } from "sequelize";

export const getAllRefPangkat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const kode = req.query.kode as string;
    const nama = req.query.nama as string;
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || 0;
    const where: any = {};
    if (kode) where.kode = kode;
    if (nama) where.nama = { [Op.like]: `%${nama}%` };
    const order: any[] = [];
    const sortField = (req.query.sortField as string) || "id";
    const sortOrder = (req.query.sortOrder as string) || "DESC";
    order.push([sortField, sortOrder.toUpperCase()]);
    const { count, rows: data } = await RefPangkat.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });
    return successResponse(res, "success get ref pangkat", data, {
      limit,
      offset,
      count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
    });
  } catch (error: unknown) {
    next(error);
  }
};
export const countAllRefPangkat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const kode = (req.query.kode as string) || undefined;
    const nama = (req.query.nama as string) || undefined;
    const where: any = {};
    if (kode) where.kode = kode;
    if (nama) where.nama = { [Op.like]: `%${nama}%` };
    const count = await RefPangkat.count({
      where,
    });
    return successResponse(res, "Success count all ref pangkat", count);
  } catch (error: unknown) {
    next(error);
  }
};
export const getRefPangkatById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await RefPangkat.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "Success get data ref pangkat", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const createRefPangkat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { kdgol, nmgol, kdgapok, nama } = req.body;
    const result = await RefPangkat.create({ kdgol, nmgol, kdgapok, nama });
    return successResponse(res, "Success create data ref pangkat", result);
  } catch (error: unknown) {
    next(error);
  }
};
export const updateRefPangkat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const { kdgol, nmgol, kdgapok, nama } = req.body;
    const data = await RefPangkat.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    if (kdgol) data.kdgol = kdgol;
    if (nmgol) data.nmgol = nmgol;
    if (kdgapok) data.kdgapok = kdgapok;
    if (nama) data.nama = nama;
    await data.save();
    await data.reload();
    return successResponse(res, "Success update data ref pangkat", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const hapusRefPangkat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await RefPangkat.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    await data.destroy();
    return successResponse(res, "Success delete data ref pangkat", {
      id,
    });
  } catch (error: unknown) {
    next(error);
  }
};
