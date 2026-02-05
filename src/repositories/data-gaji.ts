import { FindOptions } from "sequelize";
import { DataGaji } from "@/models";
import { BaseRepository } from "./base-repository";

export class DataGajiRepository extends BaseRepository<DataGaji> {
  constructor() {
    super(DataGaji);
  }

  async getTahun(options?: Pick<FindOptions<DataGaji>, "where">) {
    const data = await this.findAll({
      where: options?.where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return data;
  }

  async getBulan(tahun: string, options?: Pick<FindOptions<DataGaji>, "where">) {
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
