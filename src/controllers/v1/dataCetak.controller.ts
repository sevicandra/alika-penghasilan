import { Request, Response } from "express";
import fs from "fs";
import { Op } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { minioService } from "@/services/minio-service";
import { InternalServerError, InvalidRequestError, NotFoundError } from "@/utils/errors";
import { UUID } from "@/utils/uuid.util";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { DataCetak } from "@/repositories";

export const DataCetakControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const nip_asal = (req.query.nip_asal as string) || undefined;
    const nip_tujuan = (req.query.nip_tujuan as string) || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const hal = (req.query.hal as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (jenis) where.jenis = jenis;
    if (status) where.status = status;
    if (hal) where.perihal = { [Op.like]: `%${hal}%` };
    if (nip_asal) where.nip_asal = nip_asal;
    if (nip_tujuan) where.nip_tujuan = nip_tujuan;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const { items: data, pagination } = await DataCetak.findAllWithPagination({
      where,
      limit,
      offset,
      order,
    });

    successResponse(res, "Success count data cetak", data, pagination);
  }),
  count: asyncHandler(async (req: Request, res: Response) => {
    const nip_asal = (req.query.nip_asal as string) || undefined;
    const nip_tujuan = (req.query.nip_tujuan as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const hal = (req.query.hal as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (jenis) where.jenis = jenis;
    if (status) where.status = status;
    if (hal) where.perihal = { [Op.like]: `%${hal}%` };
    if (nip_asal) where.nip_asal = nip_asal;
    if (nip_tujuan) where.nip_tujuan = nip_tujuan;
    const count = await DataCetak.count({
      where,
    });

    successResponse(res, "Success get all data cetak", { count });
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await DataCetak.findById(id);
    if (!data) {
      throw new NotFoundError("Data not found");
    }

    successResponse(res, "Success get data cetak", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const {
      tahun,
      nip_asal,
      nip_tujuan,
      nama_tujuan,
      jenis,
      nomor,
      tanggal,
      tujuan,
      perihal,
      date,
      id_dokumen,
      status,
    } = req.body;
    const file = req.file;

    if (!file) {
      throw new InvalidRequestError("File tidak ditemukan");
    }

    const fileName = UUID.v4();

    if (file?.path) {
      const buffer = fs.readFileSync(file.path);
      await minioService.uploadFile(buffer, `${fileName}.pdf`, "application/pdf");
    }
    const data = await DataCetak.create({
      tahun,
      nip_asal,
      nip_tujuan,
      nama_tujuan,
      jenis,
      nomor,
      tanggal,
      tujuan,
      perihal,
      file: `${fileName}.pdf`,
      date,
      id_dokumen,
      status,
    });

    successResponse(res, "Success create data cetak", data);
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
        nip_asal,
        nip_tujuan,
        nama_tujuan,
        jenis,
        nomor,
        tanggal,
        tujuan,
        perihal,
        date,
        id_dokumen,
        status,
      } = req.body;
      const file = req.file;

      const data = await DataCetak.updateById(id, {
        tahun,
        nip_asal,
        nip_tujuan,
        nama_tujuan,
        jenis,
        nomor,
        tanggal,
        tujuan,
        perihal,
        date,
        id_dokumen,
        status,
      });
      if (file) {
        const buffer = fs.readFileSync(file.path);
        await minioService.uploadFile(buffer, `${data.file}`, "application/pdf");
      }
      successResponse(res, "Success update data cetak", data);
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
      const data = await DataCetak.deleteOne(
        {
          where: {
            id: id,
          },
        },
        t
      );
      successResponse(res, "Success delete data cetak", data);
    },
    {
      useTransaction: true,
    }
  ),
};
