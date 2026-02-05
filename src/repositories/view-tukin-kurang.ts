import { FindOptions } from "sequelize";
import { ViewTukinKurang } from "@/models";
import { sequelize } from "@/models";
import { BaseRepository } from "./base-repository";

export class ViewTukinKurangRepository extends BaseRepository<ViewTukinKurang> {
  constructor() {
    super(ViewTukinKurang);
  }

  async getRekap(options?: Omit<FindOptions<ViewTukinKurang>, "attributes">) {
    return await this.findOne({
      ...options,
      attributes: [
        [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
        [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
      ],
    });
  }
}
