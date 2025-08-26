import { AuthenticatedRequest } from "@/types/auth";
import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { DataLain, sequelize } from "@/models";
import { parse } from "csv-parse";

export const getAllPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || 0;
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
    const order: any[] = [];
    const sortField = (req.query.sortField as string) || "id";
    const sortOrder = (req.query.sortOrder as string) || "DESC";
    order.push([sortField, sortOrder.toUpperCase()]);
    const data = await DataLain.findAll({
      where,
      order,
      limit,
      offset,
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
    const count = await DataLain.count({ where });
    return successResponse(res, "success get all data penghasilan lain", data, {
      limit,
      offset,
      count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
    });
  } catch (error: unknown) {
    next(error);
  }
};
export const countAllPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
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
    return successResponse(
      res,
      "Success count all data penghasilan lain",
      count
    );
  } catch (error: unknown) {
    next(error);
  }
};
export const getTahunPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const nip = (req.query.nip as string) || undefined;
    const jenis = (req.query.jenis as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {};
    if (nip) where.nip = nip;
    if (jenis) where.jenis = jenis;
    if (kdsatker) where.kdsatker = kdsatker;
    const result = await DataLain.findAll({
      where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return successResponse(res, "Success get tahun penghasilan lain", result);
  } catch (error: unknown) {
    next(error);
  }
};
export const getBulanPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tahun = parseInt(req.params.tahun);
    if (!tahun || isNaN(tahun)) {
      return errorResponse(res, "Tahun tidak valid", null, 422);
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
    const result = await DataLain.findAll({
      where,
      attributes: ["bulan"],
      group: ["bulan"],
      order: [["bulan", "DESC"]],
    });
    return successResponse(res, "Success get bulan penghasilan lain", result);
  } catch (error: unknown) {
    next(error);
  }
};
export const getJenisPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    if (kdsatker) where.kdsatker = kdsatker;
    const data = await DataLain.findAll({
      where,
      attributes: ["jenis"],
      group: ["jenis"],
      order: [["jenis", "DESC"]],
    });
    return successResponse(res, "Success get jenis penghasilan lain", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const getPenghasilanLainById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataLain.findOne({ where: { id } });
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "Success get data penghasilan lain", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const createPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
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
    } = req.body;
    const data = await DataLain.create({
      bulan: bulan,
      tahun: tahun,
      kdsatker: kdsatker,
      nip: nip,
      bruto: parseInt(bruto),
      pph: parseInt(pph),
      netto: parseInt(netto),
      jenis: jenis,
      uraian: uraian,
      tanggal: +new Date(tanggal) / 1000,
      nospm: nospm,
    });
    return successResponse(
      res,
      "Success create data penghasilan lain",
      data,
      null,
      201
    );
  } catch (error: unknown) {
    next(error);
  }
};
export const importCsvPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return errorResponse(res, "File tidak ditemukan", null, 400);
    }
    const csvBuffer = req.file.buffer;
    const records: {
      bulan: string;
      tahun: string;
      kdsatker: string;
      nip: string;
      bruto: number;
      pph: number;
      netto: number;
      jenis: string;
      uraian: string;
      tanggal: number;
      nospm: string | null;
    }[] = [];

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
      (r) => !r.nip || !r.tahun || !r.bulan || !r.kdsatker || !r.jenis
    );
    if (invalid) {
      return errorResponse(res, "Data tidak valid", invalid, 400);
    }
    await DataLain.bulkCreate(records);
    return successResponse(
      res,
      "Data penghasilan lain berhasil ditambahkan",
      null,
      null,
      201
    );
  } catch (error: unknown) {
    next(error);
  }
};
export const updatePenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const {
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
    } = req.body;
    const data = await DataLain.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    if (bulan) data.bulan = bulan;
    if (tahun) data.tahun = tahun;
    if (kdsatker) data.kdsatker = kdsatker;
    if (nip) data.nip = nip;
    if (bruto) data.bruto = bruto;
    if (pph) data.pph = pph;
    if (netto) data.netto = netto;
    if (jenis) data.jenis = jenis;
    if (uraian) data.uraian = uraian;
    if (tanggal) data.tanggal = +new Date(tanggal) / 1000;
    if (nospm) data.nospm = nospm;
    await data.save();
    await data.reload();
    return successResponse(res, "Data penghasilan lain berhasil diubah", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const hapusPenghasilanLain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataLain.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    await data.destroy();
    return successResponse(res, "Data penghasilan lain berhasil dihapus", {
      id,
    });
  } catch (error: unknown) {
    next(error);
  }
};
