import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InternalServerError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { DataProfil } from "@/repositories";

export const DataPenandatanganControllerV1 = {
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
    const { items: data, pagination } = await DataProfil.findAllWithPagination({
      where,
      limit,
      offset,
      order,
    });

    successResponse(res, "Success get all data penandatangan", data, pagination);
  }),
  count: asyncHandler(async (req: Request, res: Response) => {
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const where: any = {};
    if (kdsatker) where.kdsatker = kdsatker;
    if (tahun) where.tahun = tahun;
    const count = await DataProfil.count({
      where,
    });

    successResponse(res, "Success count data penandatangan", { count });
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await DataProfil.findById(id);
    if (!data) {
      throw new NotFoundError("Data not found");
    }

    successResponse(res, "Success get data penandatangan", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const {
      tahun,
      kdsatker,
      nama_ttd_skp,
      nip_ttd_skp,
      jab_ttd_skp,
      nama_ttd_kp4,
      nip_ttd_kp4,
      jab_ttd_kp4,
      npwp_bendahara,
      nama_bendahara,
      nip_bendahara,
      tgl_spt,
    } = req.body;
    const data = await DataProfil.create({
      tahun,
      kdsatker,
      nama_ttd_skp,
      nip_ttd_skp,
      jab_ttd_skp,
      nama_ttd_kp4,
      nip_ttd_kp4,
      jab_ttd_kp4,
      npwp_bendahara,
      nama_bendahara,
      nip_bendahara,
      tgl_spt,
    });

    successResponse(res, "Success create data penandatangan", data);
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
        tahun,
        kdsatker,
        nama_ttd_skp,
        nip_ttd_skp,
        jab_ttd_skp,
        nama_ttd_kp4,
        nip_ttd_kp4,
        jab_ttd_kp4,
        npwp_bendahara,
        nama_bendahara,
        nip_bendahara,
        tgl_spt,
      } = req.body;

      const data = await DataProfil.updateById(
        id,
        {
          tahun,
          kdsatker,
          nama_ttd_skp,
          nip_ttd_skp,
          jab_ttd_skp,
          nama_ttd_kp4,
          nip_ttd_kp4,
          jab_ttd_kp4,
          npwp_bendahara,
          nama_bendahara,
          nip_bendahara,
          tgl_spt,
        },
        t
      );

      successResponse(res, "Success update data penandatangan", data);
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
      const data = await DataProfil.deleteOne(
        {
          where: {
            id: id,
          },
        },
        t
      );
      successResponse(res, "Success delete data penandatangan", data);
    },
    {
      useTransaction: true,
    }
  ),
};
