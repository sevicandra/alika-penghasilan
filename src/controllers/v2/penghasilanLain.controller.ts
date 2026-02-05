import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { AuthorizationError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { sequelize } from "@/models";
import { DataLain } from "@/repositories";

export const PenghasilanLainControllerV2 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const where: any = { nip: nip };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (jenis) where.jenis = jenis;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const { items: data, pagination } = await DataLain.findAllWithPagination({
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

    successResponse(res, "Success get all pembayaran lain", data, pagination);
  }),
  count: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const where: any = { nip: nip };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (jenis) where.jenis = jenis;
    const count = await DataLain.count({
      where,
    });

    successResponse(res, "Success count pembayaran lain", { count });
  }),
  getTahun: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }
    const jenis = (req.query.jenis as string) || undefined;
    const where: any = {
      nip: nip,
    };
    if (jenis) where.jenis = jenis;
    const data = await DataLain.getTahun({
      where,
    });

    successResponse(res, "Success get tahun pembayaran lain", data);
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
    const jenis = (req.query.jenis as string) || undefined;
    const where: any = {
      tahun: tahun,
    };
    if (nip) where.nip = nip;
    if (jenis) where.jenis = jenis;
    const data = await DataLain.getBulan(tahun, {
      where,
    });

    successResponse(res, "Success get bulan pembayaran lain", data);
  }),
  getJenis: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }
    const { tahun, bulan } = req.query;
    const where: any = {};
    if (nip) where.nip = nip;
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    const data = await DataLain.getJenis({
      where,
    });

    successResponse(res, "Success get jenis pembayaran lain", data);
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

    const data = await DataLain.findOne({
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

    successResponse(res, "Success get pembayaran lain", data);
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
    const data = await DataLain.getRekap({
      where,
    });

    successResponse(res, "Success get data rekap pembayaran lain", data);
  }),
};
