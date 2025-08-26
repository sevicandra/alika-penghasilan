import { AuthenticatedRequest } from "@/types/auth";
import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { DataSatker } from "@/models";
import { Op } from "sequelize";

export const getAllRefSatker = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const search = (req.query.keyword as string) || undefined;
    const where: any = {};
    if (search) {
      where[Op.or] = {
        nmsatker: {
          [Op.like]: `%${search}%`,
        },
        kdsatker: {
          [Op.like]: `%${search}%`,
        },
      };
    }
    const order: any[] = [];
    const sortField = (req.query.sortField as string) || "id";
    const sortOrder = (req.query.sortOrder as string) || "DESC";
    order.push([sortField, sortOrder.toUpperCase()]);
    const data = await DataSatker.findAll({
      where,
      order,
      limit,
      offset,
    });
    const count = await DataSatker.count({ where });
    return successResponse(res, "success get all ref satker", data, {
      limit,
      offset,
      count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
    });
  } catch (error: unknown) {
    next(error);
  }
};
export const countAllRefSatker = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const search = (req.query.keyword as string) || undefined;
    const where: any = {};
    if (search) {
      where[Op.or] = {
        nmsatker: {
          [Op.like]: `%${search}%`,
        },
        kdsatker: {
          [Op.like]: `%${search}%`,
        },
      };
    }
    const count = await DataSatker.findAll({
      where,
    });
    return successResponse(res, "success count all ref satker", count);
  } catch (error: unknown) {
    next(error);
  }
};
export const getRefSatkerById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataSatker.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "success get ref satker", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const getRefSatkerByKdSatker = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const kdsatker = req.params.kdsatker;
    const data = await DataSatker.findOne({ where: { kdsatker } });
    if (!data) {
      return errorResponse(
        res,
        `Data dengan kode satker ${kdsatker} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "success get ref satker", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const createRefSatker = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      kdsatker,
      nmsatker,
      header1,
      header2,
      subheader1,
      subheader2,
      subheader3,
      kota,
    } = req.body;
    const data = await DataSatker.create({
      kdsatker,
      nmsatker,
      header1,
      header2,
      subheader1,
      subheader2,
      subheader3,
      kota,
    });
    return successResponse(res, "success create ref satker", data, null, 201);
  } catch (error: unknown) {
    next(error);
  }
};
export const updateRefSatker = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const {
      kdsatker,
      nmsatker,
      header1,
      header2,
      subheader1,
      subheader2,
      subheader3,
      kota,
    } = req.body;
    const data = await DataSatker.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    if (kdsatker) data.kdsatker = kdsatker;
    if (nmsatker) data.nmsatker = nmsatker;
    if (header1) data.header1 = header1;
    if (header2) data.header2 = header2;
    if (subheader1) data.subheader1 = subheader1;
    if (subheader2) data.subheader2 = subheader2;
    if (subheader3) data.subheader3 = subheader3;
    if (kota) data.kota = kota;
    await data.save();
    await data.reload();
    return successResponse(res, "success update ref satker", data, null, 200);
  } catch (error: unknown) {
    next(error);
  }
};
export const hapusRefSatker = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataSatker.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    await data.destroy();
    return successResponse(
      res,
      "success delete ref satker",
      null,
      {
        id,
      },
      200
    );
  } catch (error: unknown) {
    next(error);
  }
};
