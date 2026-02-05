import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { minioService } from "@/services/minio-service";
import { InvalidRequestError } from "@/utils/errors";
import { fileResponse } from "@/helpers/respose.helper";

export const pdf = asyncHandler(async (req: Request, res: Response) => {
  const { fileName } = req.params;

  if (typeof fileName != "string") throw new InvalidRequestError("Invalid request");

  const stream = await minioService.getFile(fileName);
  fileResponse(res, stream, fileName, "application/pdf");
});
