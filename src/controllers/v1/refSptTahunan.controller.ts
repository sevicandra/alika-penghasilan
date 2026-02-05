import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InternalServerError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { RefSptTahunan } from "@/repositories";

export const RefSptTahunanControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const { items: data, pagination } = await RefSptTahunan.findAllWithPagination({
      limit,
      offset,
      order,
    });

    successResponse(res, "Success get all referensi spt tahunan", data, pagination);
  }),
  count: asyncHandler(async (_req: Request, res: Response) => {
    const count = await RefSptTahunan.count({});

    successResponse(res, "Success count referensi spt tahunan", { count });
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await RefSptTahunan.findById(id);
    if (!data) {
      throw new NotFoundError("Data not found");
    }

    successResponse(res, "Success get referensi spt tahunan", data);
  }),
  getByTahun: asyncHandler(async (req: Request, res: Response) => {
    const { tahun } = req.params;
    if (typeof tahun !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await RefSptTahunan.findOne({
      where: {
        tahun,
      },
    });
    if (!data) {
      throw new NotFoundError("Data not found");
    }
    successResponse(res, "Success get referensi spt tahunan", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
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
    });

    successResponse(res, "Success create referensi spt tahunan", data);
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

      const data = await RefSptTahunan.updateById(
        id,
        {
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
        },
        t
      );

      successResponse(res, "Success update referensi spt tahunan", data);
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
      const data = await RefSptTahunan.deleteOne(
        {
          where: {
            id: id,
          },
        },
        t
      );
      successResponse(res, "Success delete referensi spt tahunan", data);
    },
    {
      useTransaction: true,
    }
  ),
};
