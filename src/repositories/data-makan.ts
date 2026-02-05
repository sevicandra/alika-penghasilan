import { FindOptions } from "sequelize";
import { DataMakan } from "@/models";
import { sequelize } from "@/models";
import { BaseRepository } from "./base-repository";

export class DataMakanRepository extends BaseRepository<DataMakan> {
  constructor() {
    super(DataMakan);
  }

  async getRekap(options?: Omit<FindOptions<DataMakan>, "attributes">) {
    return await this.findOne({
      ...options,
      attributes: [
        [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
        [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
      ],
    });
  }

  async getTahun(options?: Pick<FindOptions<DataMakan>, "where">) {
    const data = await this.findAll({
      where: options?.where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return data;
  }

  async getBulan(tahun: string, options?: Pick<FindOptions<DataMakan>, "where">) {
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
