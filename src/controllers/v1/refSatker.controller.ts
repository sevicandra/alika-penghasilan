import { Request, Response } from "express";
import { Op } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InternalServerError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { DataSatker } from "@/repositories";

export const RefSatkerControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const search = (req.query.keyword as string) || undefined;
    const where: any = {};
    if (search) {
      where[Op.or] = {
        nmsatker: {
          [Op.like]: `%${search}%`,
        },
        kdsatker: {
          [Op.like]: `%${search}%`,
        },
      };
    }
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const { items: data, pagination } = await DataSatker.findAllWithPagination({
      where,
      limit,
      offset,
      order,
    });

    successResponse(res, "Success get all referensi satuan kerja", data, pagination);
  }),
  count: asyncHandler(async (req: Request, res: Response) => {
    const search = (req.query.keyword as string) || undefined;
    const where: any = {};
    if (search) {
      where[Op.or] = {
        nmsatker: {
          [Op.like]: `%${search}%`,
        },
        kdsatker: {
          [Op.like]: `%${search}%`,
        },
      };
    }
    const count = await DataSatker.count({
      where,
    });

    successResponse(res, "Success count referensi satuan kerja", { count });
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await DataSatker.findById(id);
    if (!data) {
      throw new NotFoundError("Data not found");
    }

    successResponse(res, "Success get referensi satuan kerja", data);
  }),
  getByKodeSatker: asyncHandler(async (req: Request, res: Response) => {
    const { kdSatker } = req.params;
    if (typeof kdSatker !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await DataSatker.findOne({
      where: {
        kdsatker: kdSatker,
      },
    });
    if (!data) {
      throw new NotFoundError("Data not found");
    }
    successResponse(res, "Success get referensi satuan kerja", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const { kdsatker, nmsatker, header1, header2, subheader1, subheader2, subheader3, kota } =
      req.body;
    const data = await DataSatker.create({
      kdsatker,
      nmsatker,
      header1,
      header2,
      subheader1,
      subheader2,
      subheader3,
      kota,
    });

    successResponse(res, "Success create referensi satuan kerja", data);
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
      const { kdsatker, nmsatker, header1, header2, subheader1, subheader2, subheader3, kota } =
        req.body;

      const data = await DataSatker.updateById(
        id,
        {
          kdsatker,
          nmsatker,
          header1,
          header2,
          subheader1,
          subheader2,
          subheader3,
          kota,
        },
        t
      );

      successResponse(res, "Success update referensi satuan kerja", data);
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
      const data = await DataSatker.deleteOne(
        {
          where: {
            id: id,
          },
        },
        t
      );
      successResponse(res, "Success delete referensi satuan kerja", data);
    },
    {
      useTransaction: true,
    }
  ),
};
