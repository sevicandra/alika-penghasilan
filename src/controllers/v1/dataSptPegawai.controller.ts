import { NextFunction, Response } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { AuthenticatedRequest } from "@/types/auth";
import { DataSptPegawai } from "@/models";
import { parse } from "csv-parse";

export const getAllDataSptPegawai = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || 0;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const tahun = (req.query.tahun as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const where: any = {};
    if (kdsatker) where.kdsatker = kdsatker;
    if (tahun) where.tahun = tahun;
    if (nip) where.nip = nip;
    const order: any[] = [];
    const sortField = (req.query.sortField as string) || "id";
    const sortOrder = (req.query.sortOrder as string) || "DESC";
    order.push([sortField, sortOrder.toUpperCase()]);
    const { rows: data, count } = await DataSptPegawai.findAndCountAll({
      where,
      order,
      limit,
      offset,
      include: [
        {
          association: "Pangkat",
        },
        { association: "Jabatan" },
      ],
    });
    return successResponse(
      res,
      "success get all data spt pegawai",
      data.map((item) => {
        return {
          id: item.id,
          kdsatker: item.kdsatker,
          tahun: item.tahun,
          nip: item.nip,
          npwp: item.npwp,
          kdgol: item.kdgol,
          alamat: item.alamat,
          kdkawin: item.kdkawin,
          kdjab: item.kdjab,
          nourut: item.nourut,
          nama_pangkat: item.Pangkat ? item.Pangkat.nama : null,
          nama_jabatan: item.Jabatan ? item.Jabatan.nama : null,
        };
      }),
      {
        limit,
        offset,
        count,
        totalPages: limit ? Math.ceil(count / limit) : 1,
      }
    );
  } catch (error: unknown) {
    next(error);
  }
};
export const countAllDataSptPegawai = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
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
    return successResponse(res, "Success count data spt pegawai", count);
  } catch (error: unknown) {
    next(error);
  }
};
export const getTahunDataSptPegawai = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const where: any = {};
    if (kdsatker) where.kdsatker = kdsatker;
    if (nip) where.nip = nip;
    const data = await DataSptPegawai.findAll({
      where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return successResponse(res, "Success get tahun data spt pegawai", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const getDataSptPegawaiById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataSptPegawai.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "success get data spt pegawai", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const createDataSptPegawai = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      kdsatker,
      tahun,
      nip,
      npwp,
      kdgol,
      alamat,
      kdkawin,
      kdjab,
      nourut,
    } = req.body;
    const data = await DataSptPegawai.create({
      kdsatker: kdsatker,
      tahun: tahun,
      nip: nip,
      npwp: npwp,
      kdgol: kdgol,
      alamat: alamat,
      kdkawin: kdkawin,
      kdjab: kdjab,
      nourut: nourut ? +nourut : nourut,
    });
    return successResponse(res, "success create data spt pegawai", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const updateDataSptPegawai = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      kdsatker,
      tahun,
      nip,
      npwp,
      kdgol,
      alamat,
      kdkawin,
      kdjab,
      nourut,
    } = req.body;
    const id = +req.params.id;
    const data = await DataSptPegawai.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    if (kdsatker) data.kdsatker = kdsatker;
    if (tahun) data.tahun = tahun;
    if (nip) data.nip = nip;
    if (npwp) data.npwp = npwp;
    if (kdgol) data.kdgol = kdgol;
    if (alamat) data.alamat = alamat;
    if (kdkawin) data.kdkawin = kdkawin;
    if (kdjab) data.kdjab = kdjab;
    if (nourut) data.nourut = nourut;
    await data.save();
    await data.reload();
    return successResponse(res, "success update data spt pegawai", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const hapusDataSptPegawai = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataSptPegawai.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    await data.destroy();
    return successResponse(res, "success delete data spt pegawai", {
      id,
    });
  } catch (error: unknown) {
    next(error);
  }
};
export const importCsvDataSpt = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return errorResponse(res, "File tidak ditemukan", null, 400);
    }
    const csvBuffer = req.file.buffer;
    const records: DataSptPegawai[] = [];
    const parser = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ";",
    });
    for await (const record of parser) {
      records.push(record);
    }
    const invalid = records.find(
      (r) =>
        !r.nip ||
        !r.tahun ||
        !r.npwp ||
        !r.kdsatker ||
        !r.kdgol ||
        !r.alamat ||
        !r.kdkawin ||
        !r.kdjab
    );
    if (invalid) {
      return errorResponse(res, "Data tidak valid", invalid, 400);
    }
    await DataSptPegawai.bulkCreate(records);

    return successResponse(res, "Data spt pegawai berhasil ditambahkan", null, 201);
  } catch (error: unknown) {
    next(error);
  }
};
