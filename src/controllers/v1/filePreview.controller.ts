import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@/types/auth";
import { DataCetak } from "@/models";
import { errorResponse } from "@/helpers/respose.helper";
import { MinioService } from "@/services/minio.service";
const minioClient = new MinioService();
export const filePreview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = +req.params.id;
    const { nip } = req.query;
    const data = await DataCetak.findByPk(id);
    if (!data) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }
    if (data.nip_asal !== nip && data.nip_tujuan !== nip) {
      return errorResponse(
        res,
        `Data dengan ID ${id} tidak ditemukan.`,
        null,
        404
      );
    }

    const stream = await minioClient.downloadFile(data.file);
    if (stream) {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=");
        return res.status(200).send(Buffer.concat(chunks));
      });
      stream.on("error", (err: Error) => {
        return errorResponse(res, "Terjadi kesalahan", err, 500);
      });
    }
  } catch (error: unknown) {
    next(error);
  }
};
