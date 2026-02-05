import { parse } from "csv-parse";
import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InternalServerError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { sequelize } from "@/models";
import { DataTukin } from "@/repositories";

export const DataTukinControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {
      p22: 0,
    };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    if (kdsatker) where.kdsatker = kdsatker;
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

    successResponse(res, "Success get all data tukin", data, pagination);
  }),
  count: asyncHandler(async (req: Request, res: Response) => {
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {
      p22: 0,
    };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    if (kdsatker) where.kdsatker = kdsatker;
    const count = await DataTukin.count({
      where,
    });

    successResponse(res, "Success count data tukin", { count });
  }),
  getTahun: asyncHandler(async (req: Request, res: Response) => {
    const nip = (req.query.nip as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {
      p22: 0,
    };
    if (nip) where.nip = nip;
    if (kdsatker) where.kdsatker = kdsatker;
    const data = await DataTukin.getTahun({
      where,
    });

    successResponse(res, "Success get tahun data tukin", data);
  }),
  getBulan: asyncHandler(async (req: Request, res: Response) => {
    const { tahun } = req.params;
    if (typeof tahun !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    const nip = (req.query.nip as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = { tahun: tahun, p22: 0 };
    if (nip) where.nip = nip;
    if (kdsatker) where.kdsatker = kdsatker;
    const data = await DataTukin.getBulan(tahun, {
      where,
    });

    successResponse(res, "Success get bulan data tukin", data);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await DataTukin.findOne({
      where: {
        id: id,
        p22: 0,
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

    successResponse(res, "Success get data tukin", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const { bulan, tahun, kdsatker, nip, grade, tjpokok, tjtamb, abspotr, abspotp, tkpph, potpph } =
      req.body;
    const data = await DataTukin.create({
      bulan,
      tahun,
      kdsatker,
      nip,
      grade,
      tjpokok,
      tjtamb,
      abspotr,
      abspotp,
      tkpph,
      potpph,
      p22: 0,
    });

    successResponse(res, "Success create data tukin", data);
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
        bulan,
        tahun,
        kdsatker,
        nip,
        grade,
        tjpokok,
        tjtamb,
        abspotr,
        abspotp,
        tkpph,
        potpph,
      } = req.body;

      const data = await DataTukin.updateOne(
        {
          where: {
            id: id,
            p22: 0,
          },
        },
        {
          bulan,
          tahun,
          kdsatker,
          nip,
          grade,
          tjpokok,
          tjtamb,
          abspotr,
          abspotp,
          tkpph,
          potpph,
        },
        t
      );

      successResponse(res, "Success update data tukin", data);
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
      const data = await DataTukin.deleteOne(
        {
          where: {
            id: id,
            p22: 0,
          },
        },
        t
      );
      successResponse(res, "Success delete data tukin", data);
    },
    {
      useTransaction: true,
    }
  ),
  import: asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      throw new InvalidRequestError("File tidak ditemukan");
    }

    const csvBuffer = file.buffer;
    const records = [];
    const parser = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ";",
    });
    for await (const record of parser) {
      records.push({ ...record, p22: 0 });
    }

    await DataTukin.createBulk(records);
    successResponse(res, "Berhasil membuat data tukin", null, 201);
  }),
};
