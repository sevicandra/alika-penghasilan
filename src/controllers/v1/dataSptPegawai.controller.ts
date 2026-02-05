import { parse } from "csv-parse";
import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InternalServerError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { DataSptPegawai } from "@/repositories";

export const DataSptPegawaiControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const where: any = {};
    if (kdsatker) where.kdsatker = kdsatker;
    if (tahun) where.tahun = tahun;
    if (nip) where.nip = nip;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const { items: data, pagination } = await DataSptPegawai.findAllWithPagination({
      where,
      limit,
      offset,
      order,
    });

    successResponse(res, "Success get all data spt pegawai", data, pagination);
  }),
  count: asyncHandler(async (req: Request, res: Response) => {
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const where: any = {};
    if (kdsatker) where.kdsatker = kdsatker;
    if (tahun) where.tahun = tahun;
    if (nip) where.nip = nip;
    const count = await DataSptPegawai.count({
      where,
    });

    successResponse(res, "Success count data spt pegawai", { count });
  }),
  getTahun: asyncHandler(async (req: Request, res: Response) => {
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const where: any = {};
    if (kdsatker) where.kdsatker = kdsatker;
    if (nip) where.nip = nip;
    const data = await DataSptPegawai.getTahun({
      where,
    });

    successResponse(res, "Success get tahun data spt pegawai", data);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await DataSptPegawai.findById(id);
    if (!data) {
      throw new NotFoundError("Data not found");
    }

    successResponse(res, "Success get data spt pegawai", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const { kdsatker, tahun, nip, npwp, kdgol, alamat, kdkawin, kdjab, nourut } = req.body;
    const data = await DataSptPegawai.create({
      kdsatker,
      tahun,
      nip,
      npwp,
      kdgol,
      alamat,
      kdkawin,
      kdjab,
      nourut,
    });

    successResponse(res, "Success create data spt pegawai", data);
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
      const { kdsatker, tahun, nip, npwp, kdgol, alamat, kdkawin, kdjab, nourut } = req.body;

      const data = await DataSptPegawai.updateById(id, {
        kdsatker,
        tahun,
        nip,
        npwp,
        kdgol,
        alamat,
        kdkawin,
        kdjab,
        nourut,
      });

      successResponse(res, "Success update data spt pegawai", data);
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
      const data = await DataSptPegawai.deleteOne(
        {
          where: {
            id: id,
          },
        },
        t
      );
      successResponse(res, "Success delete data spt pegawai", data);
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

    await DataSptPegawai.createBulk(records);
    successResponse(res, "Berhasil membuat data spt pegawai", null, 201);
  }),
};
