import { parse } from "csv-parse";
import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InternalServerError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { sequelize } from "@/models";
import { DataMakan } from "@/repositories";

export const UangMakanControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
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
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    const count = await DataMakan.count({
      where,
    });

    successResponse(res, "Success count data uang makan", { count });
  }),
  getTahun: asyncHandler(async (req: Request, res: Response) => {
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const where: any = {};
    if (kdsatker) where.kdsatker = kdsatker;
    if (nip) where.nip = nip;
    const data = await DataMakan.getTahun({
      where,
    });

    successResponse(res, "Success get tahun data uang makan", data);
  }),
  getBulan: asyncHandler(async (req: Request, res: Response) => {
    const { tahun } = req.params;
    if (typeof tahun !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const kdsatker = (req.query.kdsatker as string) || undefined;
    const kdanak = (req.query.kdanak as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const kdgapok = (req.query.kdgapok as string) || undefined;
    const where: any = {
      tahun: tahun,
    };
    if (nip) where.nip = nip;
    if (kdanak) where.kdanak = kdanak;
    if (kdgapok) where.kdgapok = kdgapok;
    if (kdsatker) where.kdsatker = kdsatker;
    const data = await DataMakan.getBulan(tahun, {
      where,
    });

    successResponse(res, "Success get bulan data uang makan", data);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await DataMakan.findById(id, {
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
  create: asyncHandler(async (req: Request, res: Response) => {
    const {
      bulan,
      tahun,
      kdsatker,
      kdanak,
      kdsubanak,
      nip,
      kdgol,
      jmlhari,
      tarif,
      pph,
      bruto,
      netto,
    } = req.body;
    const data = await DataMakan.create({
      bulan,
      tahun,
      kdsatker,
      kdanak,
      kdsubanak,
      nip,
      kdgol,
      jmlhari,
      tarif,
      pph,
      bruto,
      netto,
    });

    successResponse(res, "Success create data uang makan", data);
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
        kdanak,
        kdsubanak,
        nip,
        kdgol,
        jmlhari,
        tarif,
        pph,
        bruto,
        netto,
      } = req.body;

      const data = await DataMakan.updateById(
        id,
        {
          bulan,
          tahun,
          kdsatker,
          kdanak,
          kdsubanak,
          nip,
          kdgol,
          jmlhari,
          tarif,
          pph,
          bruto,
          netto,
        },
        t
      );

      successResponse(res, "Success update data uang makan", data);
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
      const data = await DataMakan.deleteOne(
        {
          where: {
            id: id,
          },
        },
        t
      );
      successResponse(res, "Success delete data uang makan", data);
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
      records.push(record);
    }

    await DataMakan.createBulk(records);
    successResponse(res, "Berhasil membuat data uang makan", null, 201);
  }),
};
