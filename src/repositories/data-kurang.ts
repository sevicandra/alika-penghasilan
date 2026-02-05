import { FindOptions } from "sequelize";
import { DataKurang } from "@/models";
import { BaseRepository } from "./base-repository";

export class DataKurangRepository extends BaseRepository<DataKurang> {
  constructor() {
    super(DataKurang);
  }

  async getTahun(options?: Pick<FindOptions<DataKurang>, "where">) {
    const data = await this.findAll({
      where: options?.where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return data;
  }

  async getBulan(tahun: string, options?: Pick<FindOptions<DataKurang>, "where">) {
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
