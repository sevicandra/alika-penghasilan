import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { AuthorizationError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { DataSptPegawai } from "@/repositories";

export const DataSptPegawaiControllerV2 = {
  getTahun: asyncHandler(async (req: Request, res: Response) => {
    const nip = req.user?.nip;
    if (!nip) {
      throw new AuthorizationError("Pengguna tidak dapat di verifikasi");
    }
    const data = await DataSptPegawai.getTahun({
      where: {
        nip: nip,
      },
    });

    successResponse(res, "Success get tahun data spt pegawai", data);
  }),
};
