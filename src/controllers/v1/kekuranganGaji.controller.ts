import { AuthenticatedRequest } from "@/types/auth";
import { NextFunction, Response } from "express";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import { DataKurang } from "@/models";
import sequelize from "@/config/db.config";
import { parse } from "csv-parse";
export const getAllKekuranganGaji = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || 0;
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const kdanak = (req.query.kdanak as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const kdgapok = (req.query.kdgapok as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    if (kdanak) where.kdanak = kdanak;
    if (kdgapok) where.kdgapok = kdgapok;
    const order: any[] = [];
    const sortField = (req.query.sortField as string) || "id";
    const sortOrder = (req.query.sortOrder as string) || "DESC";
    order.push([sortField, sortOrder.toUpperCase()]);
    const { count, rows: data } = await DataKurang.findAndCountAll({
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
    return successResponse(res, "Success get all data kekurangan gaji", data, {
      limit,
      offset,
      count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
    });
  } catch (error: unknown) {
    next(error);
  }
};
export const countAllKekuranganGaji = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tahun = (req.query.tahun as string) || undefined;
    const bulan = (req.query.bulan as string) || undefined;
    const kdanak = (req.query.kdanak as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const kdgapok = (req.query.kdgapok as string) || undefined;
    const where: any = {};
    if (tahun) where.tahun = tahun;
    if (bulan) where.bulan = bulan;
    if (nip) where.nip = nip;
    if (kdanak) where.kdanak = kdanak;
    if (kdgapok) where.kdgapok = kdgapok;
    const count = await DataKurang.count({
      where,
    });
    return successResponse(
      res,
      "Success count all data kekurangan gaji",
      count
    );
  } catch (error: unknown) {
    next(error);
  }
};
export const getTahunKekuranganGaji = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const kdanak = (req.query.kdanak as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const kdgapok = (req.query.kdgapok as string) || undefined;
    const where: any = {};
    if (nip) where.nip = nip;
    if (kdanak) where.kdanak = kdanak;
    if (kdgapok) where.kdgapok = kdgapok;
    const data = await DataKurang.findAll({
      where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });

    return successResponse(res, "Success get tahun kekurangan gaji", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const getBulanKekuranganGaji = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tahun = parseInt(req.params.tahun);
    if (!tahun || isNaN(tahun)) {
      return errorResponse(res, "Tahun tidak valid", null, 422);
    }
    const kdanak = (req.query.kdanak as string) || undefined;
    const nip = (req.query.nip as string) || undefined;
    const kdgapok = (req.query.kdgapok as string) || undefined;
    const where: any = {
      tahun: tahun,
    };
    if (nip) where.nip = nip;
    if (kdanak) where.kdanak = kdanak;
    if (kdgapok) where.kdgapok = kdgapok;
    const data = await DataKurang.findAll({
      where,
      attributes: ["bulan"],
      group: ["bulan"],
      order: [["bulan", "DESC"]],
    });
    return successResponse(res, "Success get bulan gaji", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const getKekuranganGajiById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataKurang.findByPk(id, {
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
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }

    return successResponse(res, "Success get data kekurangan gaji", data);
  } catch (error: unknown) {
    next(error);
  }
};
export const createKekuranganGaji = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      kdjns,
      kdsatker,
      kdanak,
      kdsubanak,
      kdkawin,
      kdgapok,
      kdjab,
      bulan,
      tahun,
      nip,
      gapok,
      tistri,
      tanak,
      tumum,
      ttambumum,
      tstruktur,
      tfungsi,
      bulat,
      tberas,
      tpajak,
      pberas,
      tpapua,
      tpencil,
      tlain,
      iwp,
      pph,
      sewarmh,
      tunggakan,
      utanglebih,
      potlain,
      taperum,
      bpjs,
      bpjs2,
    } = req.body;
    const data = await DataKurang.create({
      kdjns: kdjns,
      kdsatker: kdsatker,
      kdanak: kdanak,
      kdsubanak: kdsubanak,
      kdkawin: kdkawin,
      kdgapok: kdgapok,
      kdjab: kdjab,
      bulan: bulan,
      tahun: tahun,
      nip: nip,
      gapok: parseInt(gapok),
      tistri: parseInt(tistri),
      tanak: parseInt(tanak),
      tumum: parseInt(tumum),
      ttambumum: parseInt(ttambumum),
      tstruktur: parseInt(tstruktur),
      tfungsi: parseInt(tfungsi),
      bulat: parseInt(bulat),
      tberas: parseInt(tberas),
      tpajak: parseInt(tpajak),
      pberas: parseInt(pberas),
      tpapua: parseInt(tpapua),
      tpencil: parseInt(tpencil),
      tlain: parseInt(tlain),
      iwp: parseInt(iwp),
      pph: parseInt(pph),
      sewarmh: parseInt(sewarmh),
      tunggakan: parseInt(tunggakan),
      utanglebih: parseInt(utanglebih),
      potlain: parseInt(potlain),
      taperum: parseInt(taperum),
      bpjs: parseInt(bpjs),
      bpjs2: parseInt(bpjs2),
    });
    return successResponse(
      res,
      "Data kekurangan gaji berhasil ditambahkan",
      data,
      201
    );
  } catch (error: unknown) {
    next(error);
  }
};
export const importCsvKekuranganGaji = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return errorResponse(res, "File tidak ditemukan", null, 400);
    }
    const csvBuffer = req.file.buffer;
    const records: DataKurang[] = [];
    const parser = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ";",
    });
    for await (const record of parser) {
      records.push(record);
    }
    const invalid = records.find((r) => !r.nip || !r.tahun || !r.bulan);
    if (invalid) {
      return errorResponse(res, "Data tidak valid", invalid, 400);
    }
    await DataKurang.bulkCreate(records);

    return successResponse(
      res,
      "Data kekurangan gaji berhasil ditambahkan",
      null,
      201
    );
  } catch (error: unknown) {
    next(error);
  }
};
export const updateKekuranganGaji = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const {
      kdjns,
      kdsatker,
      kdanak,
      kdsubanak,
      kdkawin,
      kdgapok,
      kdjab,
      bulan,
      tahun,
      nip,
      gapok,
      tistri,
      tanak,
      tumum,
      ttambumum,
      tstruktur,
      tfungsi,
      bulat,
      tberas,
      tpajak,
      pberas,
      tpapua,
      tpencil,
      tlain,
      iwp,
      pph,
      sewarmh,
      tunggakan,
      utanglebih,
      potlain,
      taperum,
      bpjs,
      bpjs2,
    } = req.body;
    const data = await DataKurang.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan`,
        null,
        404
      );
    }
    if (kdjns) data.kdjns = kdjns;
    if (kdsatker) data.kdsatker = kdsatker;
    if (kdanak) data.kdanak = kdanak;
    if (kdsubanak) data.kdsubanak = kdsubanak;
    if (kdkawin) data.kdkawin = kdkawin;
    if (kdgapok) data.kdgapok = kdgapok;
    if (kdjab) data.kdjab = kdjab;
    if (bulan) data.bulan = bulan;
    if (tahun) data.tahun = tahun;
    if (nip) data.nip = nip;
    if (gapok) data.gapok = gapok;
    if (tistri) data.tistri = tistri;
    if (tanak) data.tanak = tanak;
    if (tumum) data.tumum = tumum;
    if (ttambumum) data.ttambumum = ttambumum;
    if (tstruktur) data.tstruktur = tstruktur;
    if (tfungsi) data.tfungsi = tfungsi;
    if (bulat) data.bulat = bulat;
    if (tberas) data.tberas = tberas;
    if (tpajak) data.tpajak = tpajak;
    if (pberas) data.pberas = pberas;
    if (tpapua) data.tpapua = tpapua;
    if (tpencil) data.tpencil = tpencil;
    if (tlain) data.tlain = tlain;
    if (iwp) data.iwp = iwp;
    if (pph) data.pph = pph;
    if (sewarmh) data.sewarmh = sewarmh;
    if (tunggakan) data.tunggakan = tunggakan;
    if (utanglebih) data.utanglebih = utanglebih;
    if (potlain) data.potlain = potlain;
    if (taperum) data.taperum = taperum;
    if (bpjs) data.bpjs = bpjs;
    if (bpjs2) data.bpjs2 = bpjs2;

    await data.save();
    await data.reload();

    return successResponse(
      res,
      "Data kekurangan gaji berhasil diperbarui",
      data
    );
  } catch (error: unknown) {
    next(error);
  }
};
export const hapusKekuranganGaji = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const data = await DataKurang.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    await data.destroy();
    return successResponse(res, "success hapus data kekurangan gaji", {
      id,
    });
  } catch (error: unknown) {
    next(error);
  }
};
