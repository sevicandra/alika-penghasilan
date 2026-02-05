import { FindOptions } from "sequelize";
import { DataTukin } from "@/models";
import { BaseRepository } from "./base-repository";

export class DataTukinRepository extends BaseRepository<DataTukin> {
  constructor() {
    super(DataTukin);
  }

  async getTahun(options?: Pick<FindOptions<DataTukin>, "where">) {
    const data = await this.findAll({
      where: options?.where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return data;
  }

  async getBulan(tahun: string, options?: Pick<FindOptions<DataTukin>, "where">) {
    const data = await this.findAll({
      where: {
        tahun: tahun,
        ...options?.where,
      },
      attributes: ["bulan"],
      group: ["bulan"],
      order: [["bulan", "DESC"]],
    });
    return data;
  }
}
