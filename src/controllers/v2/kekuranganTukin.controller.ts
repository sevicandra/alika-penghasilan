import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { AuthorizationError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { sequelize } from "@/models";
import { DataTukin, ViewTukinKurang } from "@/repositories";

export const DataKekuranganTukinControllerV2 = {
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
      p22: 1,
    };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const { items: data, pagination } = await DataTukin.findAllWithPagination({
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

    successResponse(res, "Success get all kekurangan tukin", data, pagination);
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
      p22: 1,
    };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    const count = await DataTukin.count({
      where,
    });

    successResponse(res, "Success count kekurangan tukin", { count });
  }),
  getTahun: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }
    const where: any = {
      p22: 1,
      nip: nip,
    };
    const data = await DataTukin.getTahun({
      where,
    });

    successResponse(res, "Success get tahun kekurangan tukin", data);
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
    const where: any = { tahun: tahun, p22: 1, nip: nip };
    const data = await DataTukin.getBulan(tahun, {
      where,
    });

    successResponse(res, "Success get bulan kekurangan tukin", data);
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

    const data = await DataTukin.findOne({
      where: {
        id: id,
        p22: 1,
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

    successResponse(res, "Success get kekurangan tukin", data);
  }),

  getRekap: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }
    const tahun = (req.query.tahun as string) || undefined;
    const where: any = {
      nip: nip,
    };
    if (tahun) where.tahun = tahun;

    const data = await ViewTukinKurang.getRekap({
      where,
    });

    successResponse(res, "Success get data rekap kekurangan tukin", data);
  }),
};
