import { FindOptions } from "sequelize";
import { ViewTukin } from "@/models";
import { sequelize } from "@/models";
import { BaseRepository } from "./base-repository";

export class ViewTukinRepository extends BaseRepository<ViewTukin> {
  constructor() {
    super(ViewTukin);
  }

  async getRekap(options?: Omit<FindOptions<ViewTukin>, "attributes">) {
    return await this.findOne({
      ...options,
      attributes: [
        [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
        [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
      ],
    });
  }
}
