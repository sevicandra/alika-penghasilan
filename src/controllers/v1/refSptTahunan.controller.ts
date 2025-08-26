import { AuthenticatedRequest } from "@/types/auth";
import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { RefSptTahunan } from "@/models";

export const getAllRefSptTahunan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const where: any = {};
    const data = await RefSptTahunan.findAll({ where, limit, offset });
    const count = await RefSptTahunan.count({ where });
    return successResponse(res, "Success get ref spt tahunan", data, {
      limit,
      offset,
      count,
      totalPage: limit ? Math.ceil(count / limit) : 1,
    });
  } catch (error: unknown) {
    next(error);
  }
};
export const countAllRefSptTahunan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = await RefSptTahunan.count();
    return successResponse(res, "Success get count ref spt tahunan", count);
  } catch (error: unknown) {
    next(error);
  }
};
export const getRefSptTahunanById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await RefSptTahunan.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "Success get ref spt tahunan", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const getRefSptTahunanByTahun = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tahun = req.params.tahun;
    const data = await RefSptTahunan.findOne({ where: { tahun } });
    if (!data) {
      return errorResponse(
        res,
        `Data dengan tahun ${tahun} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "Success get ref spt tahunan", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const createRefSptTahunan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      tahun,
      ptkp_wp,
      ptkp_istri,
      ptkp_anak,
      iuran_pensiun,
      biaya_jabatan,
      biaya_jabatan_maks,
      pph_tarif_1,
      pph_tarif_2,
      pph_tarif_3,
      pph_tarif_4,
      pph_limit_1,
      pph_limit_2,
      pph_limit_3,
    } = req.body;
    const data = await RefSptTahunan.create({
      tahun: tahun,
      ptkp_wp: +ptkp_wp,
      ptkp_istri: +ptkp_istri,
      ptkp_anak: +ptkp_anak,
      iuran_pensiun: +iuran_pensiun,
      biaya_jabatan: +biaya_jabatan,
      biaya_jabatan_maks: +biaya_jabatan_maks,
      pph_tarif_1: +pph_tarif_1,
      pph_tarif_2: +pph_tarif_2,
      pph_tarif_3: +pph_tarif_3,
      pph_tarif_4: +pph_tarif_4,
      pph_limit_1: +pph_limit_1,
      pph_limit_2: +pph_limit_2,
      pph_limit_3: +pph_limit_3,
    });
    return successResponse(res, "Success create ref spt tahunan", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const updateRefSptTahunan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const {
      tahun,
      ptkp_wp,
      ptkp_istri,
      ptkp_anak,
      iuran_pensiun,
      biaya_jabatan,
      biaya_jabatan_maks,
      pph_tarif_1,
      pph_tarif_2,
      pph_tarif_3,
      pph_tarif_4,
      pph_limit_1,
      pph_limit_2,
      pph_limit_3,
    } = req.body;
    const data = await RefSptTahunan.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    if (tahun) data.tahun = tahun;
    if (ptkp_wp) data.ptkp_wp = +ptkp_wp;
    if (ptkp_istri) data.ptkp_istri = +ptkp_istri;
    if (ptkp_anak) data.ptkp_anak = +ptkp_anak;
    if (iuran_pensiun) data.iuran_pensiun = +iuran_pensiun;
    if (biaya_jabatan) data.biaya_jabatan = +biaya_jabatan;
    if (biaya_jabatan_maks) data.biaya_jabatan_maks = +biaya_jabatan_maks;
    if (pph_tarif_1) data.pph_tarif_1 = +pph_tarif_1;
    if (pph_tarif_2) data.pph_tarif_2 = +pph_tarif_2;
    if (pph_tarif_3) data.pph_tarif_3 = +pph_tarif_3;
    if (pph_tarif_4) data.pph_tarif_4 = +pph_tarif_4;
    if (pph_limit_1) data.pph_limit_1 = +pph_limit_1;
    if (pph_limit_2) data.pph_limit_2 = +pph_limit_2;
    if (pph_limit_3) data.pph_limit_3 = +pph_limit_3;
    await data.save();
    await data.reload();
    return successResponse(res, "Data berhasil diperbarui", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const deleteRefSptTahunan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await RefSptTahunan.findByPk(id);
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
