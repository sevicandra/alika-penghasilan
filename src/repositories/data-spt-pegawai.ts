import { FindOptions } from "sequelize";
import { DataSptPegawai } from "@/models";
import { BaseRepository } from "./base-repository";

export class DataSptPegawaiRepository extends BaseRepository<DataSptPegawai> {
  constructor() {
    super(DataSptPegawai);
  }

  async getTahun(options?: Pick<FindOptions<DataSptPegawai>, "where">) {
    const data = await this.findAll({
      where: options?.where,
      attributes: ["tahun"],
      group: ["tahun"],
      order: [["tahun", "DESC"]],
    });
    return data;
  }
}
