import { Request, Response } from "express";
import { Op } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { minioService } from "@/services/minio-service";
import { InvalidRequestError, NotFoundError } from "@/utils/errors";
import { fileResponse } from "@/helpers/respose.helper";
import { DataCetak } from "@/repositories";

export const filePreview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nip } = req.query;
  if (typeof id !== "string" || typeof nip !== "string") {
    throw new InvalidRequestError("Invalid request");
  }

  const data = await DataCetak.findOne({
    where: {
      id: id,
      [Op.or]: [{ nip_asal: nip }, { nip_tujuan: nip }],
    },
  });
  if (!data) {
    throw new NotFoundError("Data not found");
  }

  const stream = await minioService.getFile(`${data.file}`);
  fileResponse(res, stream, `${data.nomor}.pdf`, "application/pdf");
});
