import { AuthenticatedRequest } from "@/types/auth";
import { Response, NextFunction } from "express";
import { DataCetak } from "@/models";
import { Op } from "sequelize";
import { errorResponse, successResponse } from "@/helpers/respose.helper";

export async function getAllDataTte(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || 0;
    const tahun = (req.query.tahun as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const hal = (req.query.hal as string) || undefined;
    const where: any = {
      nip_tujuan: nip,
    };
    if (tahun) where.tahun = tahun;
    if (jenis) where.jenis = jenis;
    if (status) where.status = status;
    if (hal) where.perihal = { [Op.like]: `%${hal}%` };
    const order: any[] = [];
    const sortField = (req.query.sortField as string) || "id";
    const sortOrder = (req.query.sortOrder as string) || "DESC";
    order.push([sortField, sortOrder.toUpperCase()]);
    const data = await DataCetak.findAll({
      where,
      limit,
      offset,
      order,
    });
    const count = await DataCetak.count({ where });
    return successResponse(res, "success get data tte", data, {
      limit,
      offset,
      count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
    });
  } catch (error: unknown) {
    next(error);
  }
}
export async function countAllDataTte(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { nip } = req.user || {};
  if (!nip) {
    return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
  }
  const tahun = (req.query.tahun as string) || undefined;
  const jenis = req.query.jenis as string | undefined;
  const status = (req.query.status as string) || undefined;
  const hal = (req.query.hal as string) || undefined;

  const where: any = {
    nip_tujuan: nip,
  };
  if (tahun) where.tahun = tahun;
  if (jenis) where.jenis = jenis;
  if (status) where.status = status;
  if (hal) where.perihal = { [Op.like]: `%${hal}%` };

  try {
    const count = await DataCetak.count({ where });
    return successResponse(res, "Success count data tte", count);
  } catch (error: unknown) {
    next(error);
  }
}
export async function getDataTteById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const id = parseInt(req.params.id);
    const data = await DataCetak.findByPk(id);
    if (!data || data.nip_tujuan !== nip) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "success get data tte", data);
  } catch (error: unknown) {
    next(error);
  }
}
export async function tolakDataTte(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const id = parseInt(req.params.id);
    const data = await DataCetak.findByPk(id);
    if (!data || data.nip_tujuan !== nip) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    if (data.status !== 0) {
      const statusMessage =
        data.status === 1
          ? "Permohonan telah disetujui"
          : "Permohonan sudah ditolak";
      return errorResponse(res, statusMessage, null, 400);
    }
    data.status = 2;
    await data.save();
    await data.reload();
    return successResponse(res, "Success tolak data tte", data);
  } catch (error: unknown) {
    next(error);
  }
}
