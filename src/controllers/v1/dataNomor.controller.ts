import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InternalServerError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { DataNomor } from "@/repositories";

export const DataNomorControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const where: any = {};
    if (kdsatker) where.kdsatker = kdsatker;
    if (tahun) where.tahun = tahun;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const { items: data, pagination } = await DataNomor.findAllWithPagination({
      where,
      limit,
      offset,
      order,
    });

    successResponse(res, "Success get all data nomor", data, pagination);
  }),
  count: asyncHandler(async (req: Request, res: Response) => {
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const where: any = {};
    if (kdsatker) where.kdsatker = kdsatker;
    if (tahun) where.tahun = tahun;
    const count = await DataNomor.count({
      where,
    });

    successResponse(res, "Success count data nomor", { count });
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await DataNomor.findById(id);
    if (!data) {
      throw new NotFoundError("Data not found");
    }

    successResponse(res, "Success get data nomor", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const {
      kdsatker,
      tahun,
      no_urut_skp,
      ext_skp,
      no_urut_kp4,
      ext_kp4,
      no_urut_daftar,
      ext_daftar,
      no_urut_pph,
      ext_pph,
      no_urut_final,
      ext_final,
    } = req.body;
    const data = await DataNomor.create({
      kdsatker,
      tahun,
      no_urut_skp,
      ext_skp,
      no_urut_kp4,
      ext_kp4,
      no_urut_daftar,
      ext_daftar,
      no_urut_pph,
      ext_pph,
      no_urut_final,
      ext_final,
    });

    successResponse(res, "Success create data nomor", data);
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
      const {
        kdsatker,
        tahun,
        no_urut_skp,
        ext_skp,
        no_urut_kp4,
        ext_kp4,
        no_urut_daftar,
        ext_daftar,
        no_urut_pph,
        ext_pph,
        no_urut_final,
        ext_final,
      } = req.body;

      const data = await DataNomor.updateById(
        id,
        {
          kdsatker,
          tahun,
          no_urut_skp,
          ext_skp,
          no_urut_kp4,
          ext_kp4,
          no_urut_daftar,
          ext_daftar,
          no_urut_pph,
          ext_pph,
          no_urut_final,
          ext_final,
        },
        t
      );

      successResponse(res, "Success update data nomor", data);
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
      const data = await DataNomor.deleteOne(
        {
          where: {
            id: id,
          },
        },
        t
      );
      successResponse(res, "Success delete data nomor", data);
    },
    {
      useTransaction: true,
    }
  ),
};
