import { FindOptions } from "sequelize";
import { DataLembur } from "@/models";
import { sequelize } from "@/models";
import { BaseRepository } from "./base-repository";

export class DataLemburRepository extends BaseRepository<DataLembur> {
  constructor() {
    super(DataLembur);
  }

  async getRekap(options?: Omit<FindOptions<DataLembur>, "attributes">) {
    return await this.findOne({
      ...options,
      attributes: [
        [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
        [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
      ],
    });
  }

  async getTahun(options?: Pick<FindOptions<DataLembur>, "where">) {
    const data = await this.findAll({
      where: options?.where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return data;
  }

  async getBulan(tahun: string, options?: Pick<FindOptions<DataLembur>, "where">) {
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
