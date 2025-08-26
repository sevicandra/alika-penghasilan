import { AuthenticatedRequest } from "@/types/auth";
import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { RefJabatan } from "@/models";
import { Op } from "sequelize";

export const getAllRefJabatan = async (
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
    const data = await RefJabatan.findAll({
      where,
      order,
      limit,
      offset,
    });
    const count = await RefJabatan.count({ where });
    return successResponse(res, "success get ref jabatan", data, {
      limit,
      offset,
      count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
    });
  } catch (error: unknown) {
    next(error);
  }
};
export const countAllRefJabatan = async (
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
    const count = await RefJabatan.count({
      where,
    });
    return successResponse(res, "Success count all ref jabatan", count);
  } catch (error: unknown) {
    next(error);
  }
};
export const getRefJabatanById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await RefJabatan.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "Success get data ref jabatan", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const createRefJabatan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { kode, nama } = req.body;
    const result = await RefJabatan.create({ kode, nama });
    return successResponse(res, "Success create data ref jabatan", result);
  } catch (error: unknown) {
    next(error);
  }
};
export const updateRefJabatan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const { kode, nama } = req.body;
    const data = await RefJabatan.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    if (kode) data.kode = kode;
    if (nama) data.nama = nama;
    await data.save();
    await data.reload();
    return successResponse(res, "Success update data ref jabatan", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const hapusRefJabatan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await RefJabatan.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    await data.destroy();
    return successResponse(res, "Success delete data ref jabatan", {
      id,
    });
  } catch (error: unknown) {
    next(error);
  }
};
