import { parse } from "csv-parse";
import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InternalServerError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { sequelize } from "@/models";
import { DataLembur } from "@/repositories";

export const UangLemburControllerV1 = {
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
    const { items: data, pagination } = await DataLembur.findAllWithPagination({
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

    successResponse(res, "Success get all data uang lembur", data, pagination);
  }),
  count: asyncHandler(async (req: Request, res: Response) => {
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    const count = await DataLembur.count({
      where,
    });

    successResponse(res, "Success count data uang lembur", { count });
  }),
  getTahun: asyncHandler(async (req: Request, res: Response) => {
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const where: any = {};
    if (kdsatker) where.kdsatker = kdsatker;
    if (nip) where.nip = nip;
    const data = await DataLembur.getTahun({
      where,
    });

    successResponse(res, "Success get tahun data uang lembur", data);
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
    const data = await DataLembur.getBulan(tahun, {
      where,
    });

    successResponse(res, "Success get bulan data uang lembur", data);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await DataLembur.findById(id, {
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

    successResponse(res, "Success get data uang lembur", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const {
      bulan,
      tahun,
      kdsatker,
      kdanak,
      nip,
      gol,
      jkerja,
      jlibur,
      jmakan,
      lembur,
      makan,
      pph,
      bruto,
      netto,
      keterangan,
    } = req.body;
    const data = await DataLembur.create({
      bulan,
      tahun,
      kdsatker,
      kdanak,
      nip,
      gol,
      jkerja,
      jlibur,
      jmakan,
      lembur,
      makan,
      pph,
      bruto,
      netto,
      keterangan,
    });

    successResponse(res, "Success create data uang lembur", data);
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
        nip,
        gol,
        jkerja,
        jlibur,
        jmakan,
        lembur,
        makan,
        pph,
        bruto,
        netto,
        keterangan,
      } = req.body;

      const data = await DataLembur.updateById(
        id,
        {
          bulan,
          tahun,
          kdsatker,
          kdanak,
          nip,
          gol,
          jkerja,
          jlibur,
          jmakan,
          lembur,
          makan,
          pph,
          bruto,
          netto,
          keterangan,
        },
        t
      );

      successResponse(res, "Success update data uang lembur", data);
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
      const data = await DataLembur.deleteOne(
        {
          where: {
            id: id,
          },
        },
        t
      );
      successResponse(res, "Success delete data uang lembur", data);
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

    await DataLembur.createBulk(records);
    successResponse(res, "Berhasil membuat data uang lembur", null, 201);
  }),
};
