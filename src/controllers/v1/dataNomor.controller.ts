import { NextFunction, Response } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { AuthenticatedRequest } from "@/types/auth";
import { DataNomor } from "@/models";

export const getAllDataNomor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
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
    const data = await DataNomor.findAll({
      where,
      order,
      limit,
      offset,
    });
    const count = await DataNomor.count({ where });
    return successResponse(res, "success get data nomor", data, {
      limit,
      offset,
      count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
    });
  } catch (error: unknown) {
    next(error);
  }
};
export const countAllDataNomor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const where: any = {};
    if (kdsatker) where.kdsatker = kdsatker;
    if (tahun) where.tahun = tahun;
    const count = await DataNomor.count({
      where,
    });
    return successResponse(res, "Success count data nomor", count);
  } catch (error: unknown) {
    next(error);
  }
};
export const getDataNomorById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataNomor.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "Success get data nomor", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const createDataNomor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      kdsatker,
      tahun,
      no_urut_skp,
      ext_skp,
      no_urut_kp4,
      ext_kp4,
      no_urut_daftar,
      ext_daftar,
      no_urut_pph,
      ext_pph,
      no_urut_final,
      ext_final,
    } = req.body;
    const data = await DataNomor.create({
      kdsatker: kdsatker,
      tahun: tahun,
      no_urut_skp: no_urut_skp,
      ext_skp: ext_skp,
      no_urut_kp4: no_urut_kp4,
      ext_kp4: ext_kp4,
      no_urut_daftar: no_urut_daftar,
      ext_daftar: ext_daftar,
      no_urut_pph: no_urut_pph,
      ext_pph: ext_pph,
      no_urut_final: no_urut_final,
      ext_final: ext_final,
    });
    return successResponse(res, "Success create data nomor", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const updateDataNomor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = +req.params.id;
    const {
      kdsatker,
      tahun,
      no_urut_skp,
      ext_skp,
      no_urut_kp4,
      ext_kp4,
      no_urut_daftar,
      ext_daftar,
      no_urut_pph,
      ext_pph,
      no_urut_final,
      ext_final,
    } = req.body;
    const data = await DataNomor.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    if (kdsatker) data.kdsatker = kdsatker;
    if (tahun) data.tahun = tahun;
    if (no_urut_skp) data.no_urut_skp = no_urut_skp;
    if (ext_skp) data.ext_skp = ext_skp;
    if (no_urut_kp4) data.no_urut_kp4 = no_urut_kp4;
    if (ext_kp4) data.ext_kp4 = ext_kp4;
    if (no_urut_daftar) data.no_urut_daftar = no_urut_daftar;
    if (ext_daftar) data.ext_daftar = ext_daftar;
    if (no_urut_pph) data.no_urut_pph = no_urut_pph;
    if (ext_pph) data.ext_pph = ext_pph;
    if (no_urut_final) data.no_urut_final = no_urut_final;
    if (ext_final) data.ext_final = ext_final;
    await data.save();
    await data.reload();
    return successResponse(res, "Success update data nomor", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const hapusDataNomor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = +req.params.id;
    const data = await DataNomor.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    await data.destroy();
    return successResponse(res, "Success delete data nomor", { id });
  } catch (error: unknown) {
    next(error);
  }
};
