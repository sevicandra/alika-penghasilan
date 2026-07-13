import { Request, Response } from "express";
import { Op, col, fn, where } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { AlikaService } from "@/services/alika.service";
import { EsignService } from "@/services/esign.service";
import { minioService } from "@/services/minio-service";
import { AuthorizationError, InternalServerError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { DataCetak } from "@/repositories";

export const tteController = {
  tte: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InternalServerError("Transaction not found");
      }
      const { nip, nik } = req.user!;
      if (!nip || !nik) {
        throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
      }
      const { id, passphrase } = req.body;
      const dataCetak = await DataCetak.findOne({
        where: {
          id: id,
          nip_tujuan: nip,
          [Op.and]: [where(fn("LOWER", col("jenis")), Op.ne, "kp4s")],
        },
        transaction: t,
      });
      if (!dataCetak) {
        throw new NotFoundError("Data not found");
      }
      const stream = await minioService.getFile(dataCetak.file);
      if (!stream) throw new Error("File stream could not be downloaded from Minio.");
      const blob = new Blob([stream], { type: "application/pdf" });
      const tte = await EsignService.processEsign({
        nik,
        Passphrase: passphrase,
        jenis: dataCetak.jenis,
        nomor: dataCetak.nomor,
        tujuan: dataCetak.tujuan,
        perihal: dataCetak.perihal,
        blob,
        fileName: dataCetak.file,
        tag_koordinat: `$`,
      });
      await minioService.uploadFile(tte.buffer, dataCetak.file, "application/pdf");
      dataCetak.status = 1;
      dataCetak.date = tte.date as string;
      dataCetak.id_dokumen = tte.id_dokumen as string;
      await dataCetak.save({ transaction: t });
      AlikaService.sendPushNotification({
        nip: dataCetak.nip_asal,
        message: `Permohonan TTE ${dataCetak.jenis} telah ditandatangani oleh ${dataCetak.nama_tujuan}`,
      });
      successResponse(res, "berhasil di proses");
    },
    {
      useTransaction: true,
    }
  ),
  tteKp4s: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InternalServerError("Transaction not found");
      }
      const { nip, nik } = req.user!;
      if (!nip || !nik) {
        throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
      }
      const { id, passphrase } = req.body;
      const dataCetak = await DataCetak.findOne({
        where: {
          id: id,
          nip_tujuan: nip,
          [Op.and]: [where(fn("LOWER", col("jenis")), "kp4s")],
        },
        transaction: t,
      });

      if (!dataCetak) {
        throw new NotFoundError("Data not found");
      }
      const stream = await minioService.getFile(dataCetak.file);
      if (!stream) throw new Error("File stream could not be downloaded from Minio.");
      const blob = new Blob([stream], { type: "application/pdf" });
      const tte = await EsignService.processEsign({
        nik,
        Passphrase: passphrase,
        jenis: dataCetak.jenis,
        nomor: dataCetak.nomor,
        tujuan: dataCetak.tujuan,
        perihal: dataCetak.perihal,
        blob,
        fileName: dataCetak.file,
        tag_koordinat: `#`,
      });
      await minioService.uploadFile(tte.buffer, dataCetak.file, "application/pdf");
      const tujuan = dataCetak.tujuan.split("/");
      const nama_tujuan_old = dataCetak.nama_tujuan;
      dataCetak.nip_tujuan = tujuan[1];
      dataCetak.nama_tujuan = tujuan[0];
      dataCetak.tujuan = nama_tujuan_old;
      dataCetak.jenis = "KP4";
      await dataCetak.save({ transaction: t });
      await AlikaService.sendPushNotification({
        nip: tujuan[1],
        message: `${dataCetak.tujuan} mengirimkan permohonan KP4`,
      });
      await AlikaService.sendPushNotification({
        nip: nip,
        message: `Permohonan KP4 sedang diproses oleh ${tujuan[0]}.`,
      });
      successResponse(res, "berhasil di proses");
    },
    {
      useTransaction: true,
    }
  ),
};
