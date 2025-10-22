import { AuthenticatedRequest } from "@/types/auth";
import { NextFunction, Response } from "express";
import { DataCetak } from "@/models";
import { Op } from "sequelize";
import { errorResponse, successResponse } from "@/helpers/respose.helper";

export async function getAllDataCetak(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const nip_asal = (req.query.nip_asal as string) || undefined;
    const nip_tujuan = (req.query.nip_tujuan as string) || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || 0;
    const tahun = (req.query.tahun as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const hal = (req.query.hal as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (jenis) where.jenis = jenis;
    if (status) where.status = status;
    if (hal) where.perihal = { [Op.like]: `%${hal}%` };
    if (nip_asal) where.nip_asal = nip_asal;
    if (nip_tujuan) where.nip_tujuan = nip_tujuan;
    const order: any[] = [];
    const sortField = (req.query.sortField as string) || "id";
    const sortOrder = (req.query.sortOrder as string) || "DESC";
    order.push([sortField, sortOrder.toUpperCase()]);
    const { count, rows: data } = await DataCetak.findAndCountAll({
      where,
      limit,
      offset,
      order,
    });
    return successResponse(res, "success get data cetak", data, {
      limit,
      offset,
      count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
    });
  } catch (error: unknown) {
    next(error);
  }
}
export async function countAllDataCetak(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const nip_asal = (req.query.nip_asal as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const nip_tujuan = (req.query.nip_asal as string) || undefined;
    const jenis = req.query.jenis as string | undefined;
    const status = (req.query.status as string) || undefined;
    const hal = (req.query.hal as string) || undefined;

    const where: any = {};
    if (nip_tujuan) where.nip_tujuan = nip_tujuan;
    if (tahun) where.tahun = tahun;
    if (jenis) where.jenis = jenis;
    if (status) where.status = status;
    if (hal) where.perihal = { [Op.like]: `%${hal}%` };
    if (nip_asal) where.nip_asal = nip_asal;
    const count = await DataCetak.count({ where });
    return successResponse(res, "Success count data cetak", count);
  } catch (error: unknown) {
    next(error);
  }
}
export async function getDataCetakById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    const data = await DataCetak.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "success get data cetak", data);
  } catch (error: unknown) {
    next(error);
  }
}
export async function updateDataCetak(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    const {
      tahun,
      nip_asal,
      nip_tujuan,
      nama_tujuan,
      jenis,
      nomor,
      tanggal,
      tujuan,
      perihal,
      file,
      date,
      id_dokumen,
      status,
    } = req.body;

    const data = await DataCetak.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    if (tahun) data.tahun = tahun;
    if (nip_asal) data.nip_asal = nip_asal;
    if (nip_tujuan) data.nip_tujuan = nip_tujuan;
    if (nama_tujuan) data.nama_tujuan = nama_tujuan;
    if (jenis) data.jenis = jenis;
    if (nomor) data.nomor = nomor;
    if (tanggal) data.tanggal = tanggal;
    if (tujuan) data.tujuan = tujuan;
    if (perihal) data.perihal = perihal;
    if (file) data.file = file;
    if (date) data.date = date;
    if (id_dokumen) data.id_dokumen = id_dokumen;
    if (status) data.status = status;
    await data.save();
    await data.reload();
    return successResponse(res, "Success update data cetak", data);
  } catch (error: unknown) {
    next(error);
  }
}
export async function hapusDataCetak(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    const data = await DataCetak.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    if (data.status !== 2) {
      const statusMessage =
        data.status === 1
          ? "Permohonan telah disetujui"
          : "Permohonan sedang diproses";

      return errorResponse(res, statusMessage, null, 400);
    }
    await data.destroy();
    return successResponse(res, "Success delete data cetak", { id });
  } catch (error: unknown) {
    next(error);
  }
}
