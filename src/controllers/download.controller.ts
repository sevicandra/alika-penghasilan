import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/types/auth";
import { errorResponse } from "@/helpers/respose.helper";
import { MinioService } from "@/services/minio.service";
const minioClient = new MinioService();
export const pdf = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileName } = req.params;
    const stream = await minioClient.downloadFile(fileName);
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
