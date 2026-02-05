import { parse } from "csv-parse";
import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InternalServerError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { sequelize } from "@/models";
import { DataLain } from "@/repositories";

export const PenghasilanLainControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    if (jenis) where.jenis = jenis;
    if (kdsatker) where.kdsatker = kdsatker;
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
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    if (jenis) where.jenis = jenis;
    if (kdsatker) where.kdsatker = kdsatker;
    const count = await DataLain.count({
      where,
    });

    successResponse(res, "Success count pembayaran lain", { count });
  }),
  getTahun: asyncHandler(async (req: Request, res: Response) => {
    const nip = (req.query.nip as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {};
    if (nip) where.nip = nip;
    if (jenis) where.jenis = jenis;
    if (kdsatker) where.kdsatker = kdsatker;
    const data = await DataLain.getTahun({
      where,
    });

    successResponse(res, "Success get tahun pembayaran lain", data);
  }),
  getBulan: asyncHandler(async (req: Request, res: Response) => {
    const { tahun } = req.params;
    if (typeof tahun !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    const nip = (req.query.nip as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {
      tahun: tahun,
    };
    if (nip) where.nip = nip;
    if (jenis) where.jenis = jenis;
    if (kdsatker) where.kdsatker = kdsatker;
    const data = await DataLain.getBulan(tahun, {
      where,
    });

    successResponse(res, "Success get bulan pembayaran lain", data);
  }),
  getJenis: asyncHandler(async (req: Request, res: Response) => {
    const { nip, kdsatker, tahun, bulan } = req.query;
    const where: any = {};
    if (nip) where.nip = nip;
    if (kdsatker) where.kdsatker = kdsatker;
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    const data = await DataLain.getJenis({
      where,
    });

    successResponse(res, "Success get jenis pembayaran lain", data);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await DataLain.findById(id, {
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
  create: asyncHandler(async (req: Request, res: Response) => {
    const { bulan, tahun, kdsatker, nip, bruto, pph, netto, jenis, uraian, tanggal, nospm } =
      req.body;
    const data = await DataLain.create({
      bulan,
      tahun,
      kdsatker,
      nip,
      bruto,
      pph,
      netto,
      jenis,
      uraian,
      tanggal,
      nospm,
    });

    successResponse(res, "Success create pembayaran lain", data);
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
      const { bulan, tahun, kdsatker, nip, bruto, pph, netto, jenis, uraian, tanggal, nospm } =
        req.body;

      const data = await DataLain.updateById(
        id,
        {
          bulan,
          tahun,
          kdsatker,
          nip,
          bruto,
          pph,
          netto,
          jenis,
          uraian,
          tanggal,
          nospm,
        },
        t
      );

      successResponse(res, "Success update pembayaran lain", data);
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
      const data = await DataLain.deleteOne(
        {
          where: {
            id: id,
          },
        },
        t
      );
      successResponse(res, "Success delete pembayaran lain", data);
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

    await DataLain.createBulk(records);
    successResponse(res, "Berhasil membuat pembayaran lain", null, 201);
  }),
};
