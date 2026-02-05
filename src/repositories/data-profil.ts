import { Transaction } from "sequelize";
import { NotFoundError } from "@/utils/errors";
import { DataProfil } from "@/models";
import { BaseRepository } from "./base-repository";

export class DataProfilRepository extends BaseRepository<DataProfil> {
  constructor() {
    super(DataProfil);
  }

  async getPenandatangan(kdsatker: string, tahun: string, t: Transaction) {
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
        throw new NotFoundError("Data Penandatangan Tidak Ditemukan");
      }
      return await this.create(
        {
          kdsatker: kdsatker,
          tahun: tahun,
          nama_ttd_skp: lastData.nama_ttd_skp,
          nip_ttd_skp: lastData.nip_ttd_skp,
          jab_ttd_skp: lastData.jab_ttd_skp,
          nama_ttd_kp4: lastData.nama_ttd_kp4,
          nip_ttd_kp4: lastData.nip_ttd_kp4,
          jab_ttd_kp4: lastData.jab_ttd_kp4,
          npwp_bendahara: lastData.npwp_bendahara,
          nama_bendahara: lastData.nama_bendahara,
          nip_bendahara: lastData.nip_bendahara,
          tgl_spt: Math.floor(new Date(parseInt(tahun), 11, 31).getTime() / 1000),
        },
        {
          transaction: t,
        }
      );
    }
    return data;
  }
}
