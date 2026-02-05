import { FindOptions } from "sequelize";
import { DataLain } from "@/models";
import { sequelize } from "@/models";
import { BaseRepository } from "./base-repository";

export class DataLainRepository extends BaseRepository<DataLain> {
  constructor() {
    super(DataLain);
  }

  async getRekap(options?: Omit<FindOptions<DataLain>, "attributes">) {
    return await this.findAll({
      ...options,
      group: ["jenis"],
      attributes: [
        [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
        [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
        [sequelize.col("jenis"), "jenis"],
      ],
    });
  }

  async getTahun(options?: Pick<FindOptions<DataLain>, "where">) {
    const data = await this.findAll({
      where: options?.where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return data;
  }

  async getBulan(tahun: string, options?: Pick<FindOptions<DataLain>, "where">) {
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

  async getJenis(options?: Pick<FindOptions<DataLain>, "where">) {
    const data = await this.findAll({
      where: options?.where,
      attributes: ["jenis"],
      group: ["jenis"],
      order: [["jenis", "DESC"]],
    });
    return data;
  }
}
