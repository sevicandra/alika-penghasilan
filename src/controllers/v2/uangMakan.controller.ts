import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { AuthorizationError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { sequelize } from "@/models";
import { DataMakan } from "@/repositories";

export const UangMakanControllerV2 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const where: any = {
      nip: nip,
    };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const { items: data, pagination } = await DataMakan.findAllWithPagination({
      where,
      limit,
      offset,
      order,
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

    successResponse(res, "Success get all data uang makan", data, pagination);
  }),
  count: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const where: any = {
      nip: nip,
    };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    const count = await DataMakan.count({
      where,
    });

    successResponse(res, "Success count data uang makan", { count });
  }),
  getTahun: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }

    const data = await DataMakan.getTahun({
      where: {
        nip: nip,
      },
    });

    successResponse(res, "Success get tahun data uang makan", data);
  }),
  getBulan: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }
    const { tahun } = req.params;
    if (typeof tahun !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    const data = await DataMakan.getBulan(tahun, {
      where: {
        nip: nip,
        tahun: tahun,
      },
    });

    successResponse(res, "Success get bulan data uang makan", data);
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

    const data = await DataMakan.findOne({
      where: {
        id: id,
        nip: nip,
      },
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
    if (!data) {
      throw new NotFoundError("Data not found");
    }

    successResponse(res, "Success get data uang makan", data);
  }),
  getRekap: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }
    const tahun = (req.query.tahun as string) || undefined;

    const data = await DataMakan.getRekap({
      where: {
        nip: nip,
        tahun: tahun,
      },
    });
    successResponse(res, "Success get data rekap uang makan", data);
  }),
};
