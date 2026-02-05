import { Transaction } from "sequelize";
import { NotFoundError } from "@/utils/errors";
import { DataNomor } from "@/models";
import { BaseRepository } from "./base-repository";

export class DataNomorRepository extends BaseRepository<DataNomor> {
  constructor() {
    super(DataNomor);
  }

  async getNomor(kdsatker: string, tahun: string, t: Transaction) {
    const data = await this.findOne({
      where: {
        kdsatker: kdsatker,
        tahun: tahun,
      },
      transaction: t,
    });
    if (!data) {
      const lastData = await this.findOne({
        where: {
          kdsatker: kdsatker,
        },
        transaction: t,
        order: [["tahun", "DESC"]],
      });
      if (!lastData) {
        throw new NotFoundError("Data Penomoran Tidak Ditemukan");
      }
      return await this.create(
        {
          kdsatker: kdsatker,
          tahun: tahun,
          no_urut_skp: "1",
          ext_skp: lastData.ext_skp,
          no_urut_kp4: "1",
          ext_kp4: lastData.ext_kp4,
          no_urut_daftar: "1",
          ext_daftar: lastData.ext_daftar,
          no_urut_pph: "1",
          ext_pph: lastData.ext_pph,
          no_urut_final: "1",
          ext_final: lastData.ext_final,
        },
        {
          transaction: t,
        }
      );
    }
    return data;
  }
}
