import { Request, Response } from "express";
import { Op } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import {
  AuthenticationError,
  AuthorizationError,
  InternalServerError,
  InvalidRequestError,
  NotFoundError,
} from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { DataCetak } from "@/repositories";

export const DataTteControllerV2 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
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
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);

    const { items: data, pagination } = await DataCetak.findAllWithPagination({
      where,
      limit,
      offset,
      order,
    });

    successResponse(res, "Success count data tte", data, pagination);
  }),

  count: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
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
    const count = await DataCetak.count({
      where,
    });

    successResponse(res, "Success get all data tte", { count });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    const data = await DataCetak.findOne({
      where: {
        id: id,
        nip_tujuan: nip,
      },
    });
    if (!data) {
      throw new NotFoundError("Data not found");
    }
    successResponse(res, "Success get data tte", data);
  }),

  tolak: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InternalServerError("Transaction not found");
      }
      const nip = req.user?.nip;
      if (!nip) {
        throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
      }
      const { id } = req.params;
      if (typeof id !== "string") {
        throw new InvalidRequestError("Invalid request");
      }
      const data = await DataCetak.findOne({
        where: {
          id: id,
          nip_tujuan: nip,
          status: 0,
        },
      });
      if (!data) {
        throw new AuthenticationError("Data tidak dapat di proses");
      }
      data.status = 2;
      await data.save({ transaction: t });
      successResponse(res, "Success tolak permohonan tte", data);
    },
    {
      useTransaction: true,
    }
  ),
};
