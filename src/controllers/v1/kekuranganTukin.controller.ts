import { AuthenticatedRequest } from "@/types/auth";
import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { DataTukin } from "@/models";
import sequelize from "@/config/db.config";
import { parse } from "csv-parse";

export const getAllKekuranganTukin = async (
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
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {
      p22: 1,
    };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    if (kdsatker) where.kdsatker = kdsatker;
    const order: any[] = [];
    const sortField = (req.query.sortField as string) || "id";
    const sortOrder = (req.query.sortOrder as string) || "DESC";
    order.push([sortField, sortOrder.toUpperCase()]);
    const { count, rows: data } = await DataTukin.findAndCountAll({
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
    return successResponse(res, "Success get all data tukin", data, {
      limit,
      offset,
      count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
    });
  } catch (error: unknown) {
    next(error);
  }
};
export const countAllKekuranganTukin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {
      p22: 1,
    };
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    if (kdsatker) where.kdsatker = kdsatker;

    const count = await DataTukin.count({
      where,
    });
    return successResponse(res, "Success count all data tukin", count);
  } catch (error: unknown) {
    next(error);
  }
};
export const getTahunKekuranganTukin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const nip = (req.query.nip as string) || undefined;
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = {
      p22: 1,
    };
    if (nip) where.nip = nip;
    if (kdsatker) where.kdsatker = kdsatker;
    const data = await DataTukin.findAll({
      where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return successResponse(res, "Success get tahun tukin", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const getBulanKekuranganTukin = async (
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
    const kdsatker = (req.query.kdsatker as string) || undefined;
    const where: any = { tahun: tahun, p22: 1 };
    if (nip) where.nip = nip;
    if (kdsatker) where.kdsatker = kdsatker;
    const data = await DataTukin.findAll({
      where,
      attributes: ["bulan"],
      group: ["bulan"],
      order: [["bulan", "DESC"]],
    });
    return successResponse(res, "Success get bulan tukin", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const getKekuranganTukinById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataTukin.findOne({ where: { id } });
    if (!data || data.p22 === 0) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    return successResponse(res, "Success get data tukin", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const createKekuranganTukin = async (
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
      grade,
      tjpokok,
      tjtamb,
      abspotr,
      abspotp,
      tkpph,
      potpph,
    } = req.body;
    const data = await DataTukin.create({
      bulan: bulan,
      tahun: tahun,
      kdsatker: kdsatker,
      nip: nip,
      grade: grade,
      tjpokok: parseInt(tjpokok),
      tjtamb: parseInt(tjtamb),
      abspotr: parseInt(abspotr),
      abspotp: parseInt(abspotp),
      tkpph: parseInt(tkpph),
      potpph: parseInt(potpph),
      p22: 1,
    });
    return successResponse(res, "Success create data tukin", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const importCsvKekuranganTukin = async (
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
      grade: string;
      tjpokok: number;
      tjtamb: number;
      abspotr: number;
      abspotp: number;
      tkpph: number;
      potpph: number;
    }[] = [];
    const parser = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ";",
    });
    for await (const record of parser) {
      records.push({ ...record, p22: 1 });
    }
    const invalid = records.find(
      (r) => !r.nip || !r.tahun || !r.bulan || !r.kdsatker
    );
    if (invalid) {
      return errorResponse(res, "Data tidak valid", invalid, 400);
    }
    await DataTukin.bulkCreate(records);
    return successResponse(res, "Data tukin berhasil ditambahkan", null, 201);
  } catch (error: unknown) {
    next(error);
  }
};
export const updateKekuranganTukin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = +req.params.id;
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
    const data = await DataTukin.findByPk(id);
    if (!data || data.p22 === 0) {
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
    if (grade) data.grade = grade;
    if (tjpokok) data.tjpokok = parseInt(tjpokok);
    if (tjtamb) data.tjtamb = parseInt(tjtamb);
    if (abspotr) data.abspotr = parseInt(abspotr);
    if (abspotp) data.abspotp = parseInt(abspotp);
    if (tkpph) data.tkpph = parseInt(tkpph);
    if (potpph) data.potpph = parseInt(potpph);
    await data.save();
    await data.reload();
    return successResponse(res, "Success update data tukin", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const hapusKekuranganTukin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataTukin.findByPk(id);
    if (!data || data.p22 === 0) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    await data.destroy();
    return successResponse(res, "Success delete data tukin", {
      id,
    });
  } catch (error: unknown) {
    next(error);
  }
};
