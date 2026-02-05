import { FindOptions } from "sequelize";
import { ViewKurang } from "@/models";
import { sequelize } from "@/models";
import { BaseRepository } from "./base-repository";

export class ViewKurangRepository extends BaseRepository<ViewKurang> {
  constructor() {
    super(ViewKurang);
  }

  async getRekap(options?: Omit<FindOptions<ViewKurang>, "attributes">) {
    return await this.findOne({
      ...options,
      attributes: [
        [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
        [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
      ],
    });
  }
}
