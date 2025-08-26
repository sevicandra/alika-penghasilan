import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { AuthenticatedRequest } from "@/types/auth";
import { DataSptPegawai } from "@/models";

export const getTahunDataSptPegawai = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nip } = req.user || {};
    if (!nip) {
      return errorResponse(res, "NIP pengguna tidak ditemukan.", 400);
    }
    const data = await DataSptPegawai.findAll({
      where: {
        nip: nip,
      },
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return successResponse(res, "Success get tahun data spt pegawai", data);
  } catch (error: unknown) {
    next(error);
  }
};
