import { Request, Response } from "express";
import { Op } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InternalServerError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { RefPangkat } from "@/repositories";

export const RefPangkatControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const kode = req.query.kode as string;
    const nama = req.query.nama as string;
    const where: any = {};
    if (kode) where.kode = kode;
    if (nama) where.nama = { [Op.like]: `%${nama}%` };
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const { items: data, pagination } = await RefPangkat.findAllWithPagination({
      where,
      limit,
      offset,
      order,
    });

    successResponse(res, "Success get all referensi pangkat", data, pagination);
  }),
  count: asyncHandler(async (req: Request, res: Response) => {
    const kode = req.query.kode as string;
    const nama = req.query.nama as string;
    const where: any = {};
    if (kode) where.kode = kode;
    if (nama) where.nama = { [Op.like]: `%${nama}%` };
    const count = await RefPangkat.count({
      where,
    });

    successResponse(res, "Success count referensi pangkat", { count });
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await RefPangkat.findById(id);
    if (!data) {
      throw new NotFoundError("Data not found");
    }

    successResponse(res, "Success get referensi pangkat", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const { kdgol, nmgol, kdgapok, nama } = req.body;
    const data = await RefPangkat.create({
      kdgol,
      nmgol,
      kdgapok,
      nama,
    });

    successResponse(res, "Success create referensi pangkat", data);
  }),
  update: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InternalServerError("Transaction not found");
      }
      const { id } = req.params;
      if (typeof id !== "string") {
        throw new InvalidRequestError("Invalid request");
      }
      const { kdgol, nmgol, kdgapok, nama } = req.body;

      const data = await RefPangkat.updateById(
        id,
        {
          kdgol,
          nmgol,
          kdgapok,
          nama,
        },
        t
      );

      successResponse(res, "Success update referensi pangkat", data);
    },
    {
      useTransaction: true,
    }
  ),
  delete: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InternalServerError("Transaction not found");
      }
      const { id } = req.params;
      if (typeof id !== "string") {
        throw new InvalidRequestError("Invalid request");
      }
      const data = await RefPangkat.deleteOne(
        {
          where: {
            id: id,
          },
        },
        t
      );
      successResponse(res, "Success delete referensi pangkat", data);
    },
    {
      useTransaction: true,
    }
  ),
};
